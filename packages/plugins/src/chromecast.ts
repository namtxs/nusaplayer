import { loadSDK, isIOS, type Player, type PlayerPlugin, type Source } from '@nusaplayer/core'

const IS_CHROME = !!globalThis.chrome

const ICON = `<svg viewBox="0 0 1024 1024" style="scale: 0.9;"><path d="M895.66 128H128a85.44 85.44 0 0 0-85.44 85.44v127.84H128v-127.84h767.66v597.12H597.28V896H896a85.44 85.44 0 0 0 85.44-85.44V213.44A85.44 85.44 0 0 0 896 128zM42.56 767.16v127.84h127.82a127.82 127.82 0 0 0-127.82-127.84z m0-170.56V682a213.26 213.26 0 0 1 213.28 213.32v0.68h85.44a298.38 298.38 0 0 0-298-298.72h-0.66z m0-170.54v85.44c212-0.2 384 171.5 384.16 383.5v1h85.44c-0.92-258.92-210.68-468.54-469.6-469.28z"></path></svg>`

const GETTERS = ['isPlaying', 'isMuted', 'currentTime', 'duration', 'volume'] as const

export interface ChromeCastOptions {
  autoJoinPolicy?: chrome.cast.AutoJoinPolicy
  language?: string | undefined
  receiverApplicationId?: string | undefined
  resumeSavedSession?: boolean | undefined
  /** The following flag enables Cast Connect(requires Chrome 87 or higher) */
  androidReceiverCompatible?: boolean | undefined
}

type PlayerPatch = Pick<Player, 'play' | 'pause' | 'seek' | 'setVolume' | 'mute' | 'unmute'>

class Chromecast implements PlayerPlugin {
  readonly name = 'nusaplayer-plugin-chromecast'
  readonly version = __VERSION__
  readonly key = 'chromecast'

  public player: Player
  protected remote?: cast.framework.RemotePlayer
  protected controller?: cast.framework.RemotePlayerController

  private bridged = false
  private originals?: PlayerPatch
  private onRemoteChange?: (event: cast.framework.RemotePlayerChangedEvent) => void

  constructor(public options?: ChromeCastOptions) {}

  apply(player: Player) {
    if (!this.canPlay()) return

    this.player = player
    this.registerUI()
    player.on('videosourcechanged', () => {
      if (!this.bridged || !this.isCastConnected) return
      void this.cast.getCurrentSession()?.loadMedia(this.__buildRequest())
    })

    return this
  }

  get cast() {
    return cast.framework.CastContext.getInstance()
  }

  get castSessionMedia() {
    return this.cast.getCurrentSession()?.getSessionObj().media[0]
  }

  get isCastConnected() {
    return this.cast.getCastState() === cast.framework.CastState.CONNECTED
  }

  get device() {
    return this.cast.getCurrentSession()?.getCastDevice()
  }

  hasActiveCastSession(source: Source | undefined | null) {
    const contentId = this.castSessionMedia?.media?.contentId
    return Boolean(source?.src) && contentId === source?.src
  }

  canPlay() {
    return IS_CHROME && !isIOS
  }

  async __requestChromeCast() {
    this.ensureRemote()

    if (this.hasActiveCastSession(this.player.options.source)) {
      return
    }

    this.cast.setOptions({
      receiverApplicationId: window.chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
      autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
      resumeSavedSession: true,
      androidReceiverCompatible: true,
      ...this.options
    })

    if (!this.isCastConnected) {
      const errorCode = await this.cast.requestSession()
      if (errorCode) {
        throw new Error(`Chrome Cast Error Code: ${errorCode}`)
      }
    }

    return this.cast.getCurrentSession()?.loadMedia(this.__buildRequest())
  }

  __buildRequest() {
    const { source, isLive } = this.player.options

    const mediaInfo = new chrome.cast.media.MediaInfo(source.src, contentType(this.player, source))
    ;(mediaInfo as { contentUrl?: string }).contentUrl = source.src
    mediaInfo.streamType = isLive ? chrome.cast.media.StreamType.LIVE : chrome.cast.media.StreamType.BUFFERED

    const metadata = new chrome.cast.media.GenericMediaMetadata()
    if (source.title) metadata.title = source.title
    if (source.poster) metadata.images = [{ url: source.poster, height: null, width: null }]
    mediaInfo.metadata = metadata

    const subtitles = this.player.context.ui?.config.subtitle?.source as
      | { name?: string; src: string; type?: string; language?: string; default?: boolean }[]
      | undefined
    const request = new chrome.cast.media.LoadRequest(mediaInfo)

    if (subtitles?.length) {
      mediaInfo.tracks = subtitles.map((sub, id) => {
        const track = new chrome.cast.media.Track(id, chrome.cast.media.TrackType.TEXT)
        track.name = sub.name || `Caption ${id + 1}`
        track.trackContentId = sub.src
        track.trackContentType = subtitleType(sub)
        track.language = sub.language || sub.name || 'und'
        track.subtype = chrome.cast.media.TextTrackType.CAPTIONS
        return track
      })
      const selected = subtitles.findIndex((sub) => sub.default)
      if (selected >= 0) request.activeTrackIds = [selected]
    }

    request.autoplay = this.player.isPlaying
    request.currentTime = this.player.currentTime

    return request
  }

  async _loadCast() {
    if (!window.cast?.framework) {
      await loadSDK('https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1', 'cast')
      await customElements.whenDefined('google-cast-launcher')
    }
    this.ensureRemote()
  }

  async start() {
    try {
      await this._loadCast()

      if (this.isCastConnected && this.hasActiveCastSession(this.player.options.source)) {
        this.detachControls(true)
        this.cast.endCurrentSession(true)
        return
      }

      const errorCode = await this.__requestChromeCast()
      if (errorCode) {
        throw new Error(`Chrome Cast Error Code: ${errorCode}`)
      }
      this.attachControls()
    } catch (error) {
      this.player.emit('cast-error', error)
    }
  }

  destroy() {
    if (!this.player) return
    this.detachControls(false)
    if (window.cast?.framework && this.isCastConnected) {
      this.cast.endCurrentSession(false)
    }
    this.unbindRemote()
  }

  registerUI() {
    if (!this.player.context.ui) return

    const { menu, icons } = this.player.context.ui

    menu?.register({
      key: this.key,
      name: this.player.locales.get('Chromecast'),
      position: 'top',
      icon: icons.chromecast || ICON,
      onClick: () => this.start()
    })
  }

  private ensureRemote() {
    if (this.remote) return

    this.remote = new cast.framework.RemotePlayer()
    this.controller = new cast.framework.RemotePlayerController(this.remote)
    this.onRemoteChange = (event) => this.handleRemoteEvent(event)
    this.controller.addEventListener(cast.framework.RemotePlayerEventType.ANY_CHANGE, this.onRemoteChange)
  }

  private unbindRemote() {
    if (this.controller && this.onRemoteChange) {
      this.controller.removeEventListener(cast.framework.RemotePlayerEventType.ANY_CHANGE, this.onRemoteChange)
    }
    this.onRemoteChange = undefined
    this.controller = undefined
    this.remote = undefined
  }

  private handleRemoteEvent(event: cast.framework.RemotePlayerChangedEvent) {
    if (!this.bridged || !this.remote) {
      if (event.field === 'isConnected' && event.value && this.hasActiveCastSession(this.player.options.source)) {
        this.attachControls()
      }
      return
    }

    if (event.field === 'isConnected' && !event.value) {
      this.detachControls(true)
      return
    }

    switch (event.field) {
      case 'isPaused':
      case 'playerState':
        this.player.emit(this.remote.isPaused ? 'pause' : 'play')
        break
      case 'currentTime':
        this.player.emit('timeupdate')
        break
      case 'duration':
        this.player.emit('durationchange')
        break
      case 'volumeLevel':
      case 'isMuted':
        this.player.emit('volumechange')
        break
    }
  }

  private attachControls() {
    if (this.bridged || !this.remote || !this.controller) return

    const player = this.player
    const remote = this.remote
    const controller = this.controller

    this.originals = {
      play: player.play.bind(player),
      pause: player.pause.bind(player),
      seek: player.seek.bind(player),
      setVolume: player.setVolume.bind(player),
      mute: player.mute.bind(player),
      unmute: player.unmute.bind(player)
    }

    this.originals.pause()
    this.bridged = true
    player.$root.setAttribute('data-np-cast', '')
    this.setPressed(true)

    patch(player, 'play', () => {
      if (remote.isPaused) controller.playOrPause()
      return Promise.resolve()
    })
    patch(player, 'pause', () => {
      if (!remote.isPaused) controller.playOrPause()
    })
    patch(player, 'seek', (time: number) => {
      remote.currentTime = time
      controller.seek()
    })
    patch(player, 'setVolume', (volume: number) => {
      remote.volumeLevel = volume > 1 ? 1 : volume < 0 ? 0 : volume
      controller.setVolumeLevel()
      if (remote.volumeLevel > 0 && remote.isMuted) controller.muteOrUnmute()
    })
    patch(player, 'mute', () => {
      if (!remote.isMuted) controller.muteOrUnmute()
    })
    patch(player, 'unmute', () => {
      if (remote.isMuted) controller.muteOrUnmute()
    })

    defineGetter(player, 'isPlaying', () => !remote.isPaused)
    defineGetter(player, 'isMuted', () => remote.isMuted)
    defineGetter(player, 'currentTime', () => remote.currentTime || 0)
    defineGetter(player, 'duration', () => remote.duration || 0)
    defineGetter(player, 'volume', () => remote.volumeLevel)

    player.emit(remote.isPaused ? 'pause' : 'play')
    player.emit('timeupdate')
    player.emit('caststart', { device: this.device?.friendlyName })

    const device = this.device?.friendlyName
    if (device) {
      player.emit('notice', { text: player.locales.get('Casting to %s', device) })
    }
  }

  private detachControls(resumeLocal: boolean) {
    if (!this.bridged || !this.originals) {
      this.setPressed(false)
      return
    }

    const time = this.remote?.currentTime ?? 0
    const shouldPlay = resumeLocal && Boolean(this.remote && !this.remote.isPaused)
    const player = this.player
    const originals = this.originals

    GETTERS.forEach((key) => {
      delete (player as unknown as Record<string, unknown>)[key]
    })
    patch(player, 'play', originals.play)
    patch(player, 'pause', originals.pause)
    patch(player, 'seek', originals.seek)
    patch(player, 'setVolume', originals.setVolume)
    patch(player, 'mute', originals.mute)
    patch(player, 'unmute', originals.unmute)

    this.originals = undefined
    this.bridged = false
    player.$root.removeAttribute('data-np-cast')
    this.setPressed(false)

    if (Number.isFinite(time)) originals.seek(time)
    if (shouldPlay) void originals.play()
    else player.emit('pause')

    player.emit('castend')
  }

  private setPressed(on: boolean) {
    this.player.$root
      ?.querySelector<HTMLElement>(`[data-key="${this.key}"] button`)
      ?.setAttribute('aria-pressed', String(on))
  }
}

function patch<K extends keyof PlayerPatch>(player: Player, key: K, value: PlayerPatch[K]) {
  ;(player as unknown as Record<string, unknown>)[key] = value
}

function defineGetter(player: Player, key: (typeof GETTERS)[number], get: () => unknown) {
  Object.defineProperty(player, key, { configurable: true, enumerable: true, get })
}

function contentType(player: Player, source: Source) {
  if (source.type) return source.type
  const format = (source.format || '').toLowerCase()
  const loader = player.loader?.key
  if (format === 'hls' || format === 'm3u8' || loader === 'hls') return 'application/x-mpegurl'
  if (format === 'dash' || format === 'mpd' || loader === 'dash') return 'application/dash+xml'
  if (format === 'webm') return 'video/webm'
  return 'video/mp4'
}

function subtitleType(sub: { src: string; type?: string }) {
  if (sub.type) return sub.type
  if (/\.ttml(\?|#|$)/i.test(sub.src)) return 'application/ttml+xml'
  return 'text/vtt'
}

export default Chromecast
