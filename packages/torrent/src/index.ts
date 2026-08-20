import { loadSDK, type Player, type PlayerPlugin, type Source } from '@nusaplayer/core'
import type Webtorrent from 'webtorrent'

export type PluginOptions = {
  config?: Record<string, any>
  matcher?: (src: Source) => boolean
  /**
   * https://cdn.jsdelivr.net/npm/webtorrent@0.98.18/webtorrent.min.js
   */
  library?: string
}

class TorrentPlugin implements PlayerPlugin {
  key = 'torrent'
  name = 'nusaplayer-plugin-torrent'
  //@ts-ignore
  version = __VERSION__

  static defaultMatcher: PluginOptions['matcher'] = (source) =>
    /magnet:?[^\"]+/.test(source.src) || /.*\.torrent/.test(source.src)

  static library: Webtorrent.WebTorrent

  player!: Player

  instance?: Webtorrent.Instance
  private loadToken = 0
  private onLoadedMetadata?: (e: any) => void

  constructor(public options: PluginOptions) {}

  apply(player: Player) {
    this.player = player
    return this
  }

  async load({ $video }: Player, source: Source) {
    const { config = {}, matcher = TorrentPlugin.defaultMatcher, library } = this.options

    if (!matcher!(source)) return false

    if (!TorrentPlugin.library) {
      TorrentPlugin.library =
        (globalThis as any).WebTorrent ||
        (library
          ? await loadSDK(library, 'WebTorrent')
          : (await import('webtorrent/webtorrent.min.js')).default)
    }

    const webtorrent = TorrentPlugin.library

    if (!this.player?.$video) return false
    if (!webtorrent.WEBRTC_SUPPORT) return false

    const token = ++this.loadToken
    const instance: Webtorrent.Instance = (this.instance = new webtorrent(config))

    const medias: Webtorrent.TorrentFile[] = []

    instance.add(source.src, (torrent) => {
      if (token !== this.loadToken || this.instance !== instance || !this.player?.$video) return

      torrent.files.forEach((file) => {
        if (file.name.endsWith('.mp4')) {
          medias.push(file)
        }
        else if (file.name.startsWith('poster')) {
          file.getBlobURL((err, url) => {
            if (err || !url || token !== this.loadToken) return
            $video.poster = url
          })
        }
      })

      if (!medias.length) {
        this.player.emit('notice', { text: 'torrent: media not found' })
        return
      }

      this.onLoadedMetadata = (e) => {
        if (token !== this.loadToken || !this.instance) return
        setTimeout(() => {
          if (token === this.loadToken) this.player.emit('canplay', e)
        })
      }
      this.player.once('loadedmetadata', this.onLoadedMetadata)

      medias[0]!.renderTo($video, { controls: false })

      this.player.context.ui?.menu.register({
        key: 'torrent',
        name: 'Torrent',
        position: 'top',
        children: medias.map((media, i) => ({
          name: media.name,
          default: i == 0,
          value: media
        })),
        onChange({ value, name }: any, elm: HTMLElement) {
          elm.innerText = name
          value.renderTo($video, { controls: false })
        }
      })
    })

    return this
  }

  async unload() {
    this.loadToken++
    this.player.context.ui?.menu.unregister('torrent')
    if (this.onLoadedMetadata) {
      this.player.off('loadedmetadata', this.onLoadedMetadata)
      this.onLoadedMetadata = undefined
    }
    if (this.instance) {
      const instance = this.instance
      this.instance = undefined
      await instance.destroy()
    }
  }

  async destroy() {
    await this.unload()
  }
}

export default function create(options: PluginOptions = {}) {
  return new TorrentPlugin(options)
}
