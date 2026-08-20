import type { Player, Source, PlayerPlugin, PartialRequired } from '@nusaplayer/core'
import type { Highlight, SubtitleSource, Thumbnails, UIInterface } from '@nusaplayer/ui'

import './playlist.css'

interface Ctx {
  ui: UIInterface
  danmaku?: any
}

interface Segment {
  uri: string
  timeline: number
  title: string
}

export interface PlaylistOptions {
  sources?: PlaylistSource[]
  customFetcher?: (
    player: Player,
    source: PlaylistSource,
    index: number
  ) => Promise<PlaylistSource> | PlaylistSource
  autoNext?: boolean
  autoHide?: boolean
  initialIndex?: number
  m3uList?:
    | {
        sourceFormat?: (info: Segment) => Source
      }
    | true
}

export interface PlaylistSource extends Omit<Source, 'src'> {
  src?: string
  id?: string | number
  duration?: string
  subtitles?: SubtitleSource[]
  thumbnails?: Thumbnails
  highlights?: Highlight[]
  // see @nusaplayer/danmaku
  danmaku?: string | Function | any[]
}

export default class PlaylistPlugin implements PlayerPlugin {
  key = 'playlist'
  name = 'nusaplayer-plugin-playlist'
  version = __VERSION__

  //@ts-expect-error
  static m3u8Parser = globalThis.m3u8Parser

  player!: Player<Ctx>

  currentIndex?: number

  $root!: HTMLDivElement

  options: PartialRequired<PlaylistOptions, 'autoNext' | 'autoHide' | 'sources'>

  constructor(options?: PlaylistOptions) {
    this.options = Object.assign({ autoNext: true, autoHide: true, sources: [] }, options)
  }

  apply(player: Player) {
    if (player.isNativeUI) return

    this.player = player as Player<Ctx>

    this._init()

    return this
  }

  async _init() {
    const start = () => {
      this.renderContainer()
      this.changeSourceList(this.options.sources)
      if (typeof initialIndex == 'number') {
        this.changeSource(initialIndex)
      }
      if (this.options.autoNext) {
        this.player.on(['ended', 'error'], () => {
          this.next()
        })
      }
      this.player.context.ui?.keyboard?.register({
        L: () => {
          this.$root.classList.toggle('playlist__active')
        }
      })
    }

    const { initialIndex, m3uList, sources } = this.options

    if (m3uList && sources[0]?.src) {
      if (!PlaylistPlugin.m3u8Parser) {
        //@ts-ignore
        PlaylistPlugin.m3u8Parser = globalThis.m3u8Parser || (await import('m3u8-parser'))
      }

      fetch(sources[0].src)
        .then((resp) => resp.text())
        .then((manifest) => {
          if (!this.player?.$root) return
          const parser = new PlaylistPlugin.m3u8Parser.Parser()
          parser.push(manifest)
          parser.end()
          this.options.sources = parser.manifest.segments.map((seg: Segment) => {
            if ((<any>m3uList)?.sourceFormat) {
              return (<any>m3uList).sourceFormat(seg)
            }
            return { src: seg.uri, title: seg.title }
          })
          start()
        })
        .catch((err) => {
          this.player.emit('notice', { pluginName: this.name, text: 'Playlist: ' + (<Error>err).message })
        })
    } else {
      start()
    }
  }

  get isWaiting() {
    return !!this.$root?.classList.contains('playlist__wait')
  }

  changeSource(idx: number) {
    if (!this.$root || !this.options.sources[idx] || this.isWaiting) return

    const $target = this.$root.querySelector(`.playlist-list-item[data-index='${idx}']`)

    this.$root.classList.add('playlist__wait')
    $target?.classList.add('playlist-source__progress')

    const source: PlaylistSource = this.options.sources[idx]!

    return new Promise<PlaylistSource>((resolve) => {
      if (!source.src && this.options.customFetcher) {
        resolve(this.options.customFetcher?.(this.player, source, idx))
        return
      }
      resolve(source)
    })
      .then((source) => {
        if (!source.src) {
          this.player.context.ui?.notice('Empty Source')
          throw new Error('Empty Source')
        }

        const { src, poster, format, title, subtitles, thumbnails, highlights, danmaku } = source

        return this.player.changeSource({ src, poster, format, title }).then(() => {
          if (!this.player?.$root) return
          if (subtitles) {
            this.player.context.ui?.subtitle?.changeSource(subtitles)
          }
          if (thumbnails) {
            this.player.context.ui?.changThumbnails?.(thumbnails)
          }
          if (highlights) {
            this.player.context.ui?.changHighlightSource?.(highlights)
          }
          if (danmaku) {
            this.player.context.danmaku?.changeSource(danmaku)
          }
        })
      })
      .then(() => {
        if (!this.player?.$root) return
        this.player.emit('playlistsourcechange', { source, id: idx })
        if (this.options.autoHide) {
          setTimeout(() => {
            this.hideUI()
          }, 300)
        }
      })
      .catch((error) => {
        this.player?.emit('playlistsourceerror', { error: error?.payload || error, idx })
      })
      .finally(() => {
        if (!this.$root || !this.player?.$root) return
        this.currentIndex = idx
        this._updateHeader()

        this.$root.querySelector('.playlist-source__active')?.classList.remove('playlist-source__active')
        $target?.classList.add('playlist-source__active')
        setTimeout(() => {
          this.$root?.classList.remove('playlist__wait')
          $target?.classList.remove('playlist-source__progress')
        }, 300)
      })
  }

  changeSourceList(sources: PlaylistSource[]) {
    this.options.sources = sources
    this.renderList(sources)
    this.player.emit('playlistchange', sources)
  }

  next() {
    this.changeSource((this.currentIndex || 0) + 1)
  }

  previous() {
    this.changeSource((this.currentIndex || 0) - 1)
  }

  showUI() {
    this.$root?.classList.add('playlist__active')
  }

  hideUI() {
    this.$root?.classList.remove('playlist__active')
  }

  renderContainer() {
    const $playlist = `
    <div class="playlist-head">
      <span class="playlist-head-title">${this.player.locales.get('Playlist')}</span>
      <div class="playlist-back">${
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>`
      }</div>
    </div>
    <div class="playlist-list">
    </div>`

    this.$root = document.createElement('div')
    this.$root.innerHTML = $playlist
    this.$root.className = 'playlist'

    this.$root.onclick = (e) => {
      const target = e.target as HTMLDivElement

      if (target.classList.contains('playlist-list-item')) {
        this.changeSource(+target.getAttribute('data-index')!)
      } else if (
        target.classList.contains('playlist-back') ||
        (target == this.$root && target.classList.contains('playlist__active'))
      ) {
        this.hideUI()
      }
    }

    this.player.context.ui?.$root?.appendChild(this.$root)

    this.player.context.ui?.menu?.register({
      name: this.player.locales.get('Playlist'),

      icon: this.player.context.ui.icons.playlist,
      position: 'top',
      onClick: () => {
        this.showUI()
        const list = this.$root.querySelector('.playlist-list')!
        const active = this.$root.querySelector<HTMLDivElement>('.playlist-source__active')
        if (active && list.scrollHeight > 0 && this.currentIndex) {
          list.scrollTo(0, active.offsetTop - active.offsetHeight)
        }
      }
    })
  }

  renderList(sources: PlaylistSource[]) {
    const child = sources
      .map(
        (source, idx) => `
  <div class="playlist-list-item" data-index="${idx}">
  <div class="playlist-list-item-thumb">
    ${
      source.poster
        ? `<img class="playlist-list-item-img" src="${source.poster}" alt="${
            source.title || ''
          }" loading="lazy" onerror="this.classList.add('playlist-list-item-img__error');"/>`
        : '<span>EMPTY</span>'
    }
    </div>

    <div class="playlist-list-item-desc">
      <p>${source.title}</p>
      ${source.duration ? `<span>${source.duration}</span>` : ''}
    </div>
  </div>`
      )
      .join('')

    this._updateHeader()
    const $list = this.$root?.querySelector('.playlist-list')
    if ($list) $list.innerHTML = child
  }

  _updateHeader() {
    const $title = this.$root?.querySelector('.playlist-head-title')
    if (!$title) return
    $title.textContent = `${this.player.locales.get(
      'Playlist'
    )} (${this.currentIndex !== undefined ? `${this.currentIndex + 1}/` : ''}${this.options.sources.length})`
  }

  destroy() {
    this.currentIndex = undefined
    this.options.sources = []
    if (this.$root) this.renderList([])
  }
}
