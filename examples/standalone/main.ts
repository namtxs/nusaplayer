import { html, render } from 'lit'

import { Player } from '@nusaplayer/core'
import Danmaku from '@nusaplayer/danmaku'
import dash from '@nusaplayer/dash'
import hls from '@nusaplayer/hls'
import mpegts from '@nusaplayer/mpegts'
import ui from '@nusaplayer/ui'
import shaka from '@nusaplayer/shaka'
import torrent from '@nusaplayer/torrent'
import { Playlist, Chromecast } from '@nusaplayer/plugins'

import emptyBuffer from './emptyBuffer'
import { DEMO, highlight } from './constants'

interface Ctx {
  ui: ReturnType<typeof ui>
  hls: ReturnType<typeof hls>
  dash: ReturnType<typeof dash>
  mpegts: ReturnType<typeof mpegts>
  danmaku: Danmaku
  playlist: Playlist
}

function stopLoad() {
  player.loader?.destroy()
  const u8 = Uint8Array.from(emptyBuffer)
  player.$video.src = URL.createObjectURL(new Blob([u8.buffer]))
}

let player: Player<Ctx>

render(
  html`
    <div class="brand">
      <h4>NusaPlayer</h4>
      <span class="ver">v${Player.version}</span>
    </div>
    <div class="meta-actions">
      <button @click="${() => !player && init()}">Create</button>
      <button
        @click="${async () => {
          const current = player
          player = null as any
          await current?.destroy()
        }}"
      >
        Destroy
      </button>
    </div>
  `,
  document.getElementById('meta')!
)

const init = () => {
  player = Player.make<Ctx>('#player', {
    // muted: true,
    volume: 0.5,
    source: {
      src: '',
      poster: DEMO.poster,
      title: "Disney's Oceans"
    },
    lang: 'en'
  })
    .use([
      ui({
        theme: {
          primaryColor: '#fb7299',
          controller: {
            setting: 'auto',
            display: 'always',
            coverButton: true,
            displayBehavior: 'hover'
          }
        },
        keyboard: { global: true },
        screenshot: true,
        pictureInPicture: true
      }),
      torrent({
        library: 'https://cdn.jsdelivr.net/npm/webtorrent@0.98.18/webtorrent.min.js'
      }),
      hls({ forceHLS: true }),
      dash(),
      mpegts(),
      shaka({
        // qualityControlType: 'setting',
        library: 'https://cdn.jsdelivr.net/npm/shaka-player@4.14.1/dist/shaka-player.compiled.debug.js'
      }),
      new Danmaku({
        enable: true,
        displaySender: true
      }),
      new Playlist({
        initialIndex: 0,
        sources: [
          {
            title: "Disney's Oceans - MP4",
            poster: DEMO.poster,
            src: DEMO.mp4,
            duration: '00:46',
            danmaku: DEMO.danmaku,
            subtitles: [
              { name: 'English', default: true, src: DEMO.enSrt },
              { name: 'Indonesia', src: DEMO.idSrt }
            ],
            highlights: highlight
          },
          {
            title: 'Big Buck Bunny - HLS',
            src: DEMO.hls,
            poster: DEMO.bbbPoster,
            duration: '10:34'
          },
          {
            title: 'Big Buck Bunny - DASH',
            src: DEMO.dash,
            poster: DEMO.bbbPoster,
            duration: '10:34'
          },
          {
            title: 'HLS - multi quality & subtitle & audio',
            src: DEMO.hlsMulti
          },
          {
            title: 'DASH - multi quality & subtitle & audio',
            src: DEMO.dashMulti
          },
          {
            title: 'FLV',
            src: DEMO.flv,
            format: 'flv'
          },
          {
            title: 'WebTorrent - Sintel',
            src: DEMO.torrent
          },
          {
            title: 'DASH DRM',
            id: 'dash-drm'
          }
        ],
        customFetcher(player, source) {
          if (source.id === 'dash-drm') {
            ;(player.context.dash as ReturnType<typeof dash>).options.drm = {
              'com.widevine.alpha': {
                serverURL: 'https://drm-widevine-licensing.axtest.net/AcquireLicense',
                httpRequestHeaders: {
                  'X-AxDRM-Message':
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoxLCJjb21fa2V5X2lkIjoiYjMzNjRlYjUtNTFmNi00YWUzLThjOTgtMzNjZWQ1ZTMxYzc4IiwibWVzc2FnZSI6eyJ0eXBlIjoiZW50aXRsZW1lbnRfbWVzc2FnZSIsImtleXMiOlt7ImlkIjoiOWViNDA1MGQtZTQ0Yi00ODAyLTkzMmUtMjdkNzUwODNlMjY2IiwiZW5jcnlwdGVkX2tleSI6ImxLM09qSExZVzI0Y3Iya3RSNzRmbnc9PSJ9XX19.4lWwW46k-oWcah8oN18LPj5OLS5ZU-_AQv7fe0JhNjA'
                },
                priority: 0
              }
            }
            return {
              ...source,
              src: 'https://media.axprod.net/TestVectors/v7-MultiDRM-SingleKey/Manifest_1080p.mpd'
            }
          }
          ;(player.context.dash as ReturnType<typeof dash>).options.drm = null
          return source
        }
      }),
      new Chromecast()
    ])
    .create()
}

init()

function getUi() {
  return player?.context.ui
}

render(
  html`
    <p class="side-title">
      Playground
      <span>Klik untuk uji notice & toast</span>
    </p>

    <h5>Posisi notice</h5>
    <div class="btn-col">
      <button class="notice" @click=${() => getUi()?.notice('Kiri atas', 'top-left')}>
        <span class="dot"></span>Kiri atas
      </button>
      <button class="notice" @click=${() => getUi()?.notice('Atas tengah', 'top')}>
        <span class="dot"></span>Atas
      </button>
      <button class="notice" @click=${() => getUi()?.notice('Kanan atas', 'top-right')}>
        <span class="dot"></span>Kanan atas
      </button>
      <button class="notice" @click=${() => getUi()?.notice('Tengah layar', 'center')}>
        <span class="dot"></span>Tengah
      </button>
      <button class="notice" @click=${() => getUi()?.notice('Kiri bawah', 'left-bottom')}>
        <span class="dot"></span>Kiri bawah
      </button>
      <button class="notice" @click=${() => getUi()?.notice('Bawah tengah', 'bottom')}>
        <span class="dot"></span>Bawah
      </button>
      <button class="notice" @click=${() => getUi()?.notice('Kanan bawah', 'bottom-right')}>
        <span class="dot"></span>Kanan bawah
      </button>
      <button
        class="muted"
        @click=${() => player?.emit('notice', { text: 'Lewat player.emit("notice")', pos: 'top' })}
      >
        <span class="dot"></span>emit notice
      </button>
    </div>

    <h5>Toast</h5>
    <div class="btn-col">
      <button
        class="info"
        @click=${() => getUi()?.toast('Sudah beralih ke 1080P')}
      >
        <span class="dot"></span>Teks singkat
      </button>
      <button
        class="action"
        @click=${() =>
          getUi()?.toast({
            text: 'Ganti ke kualitas lebih rendah?',
            actions: [
              { text: 'Batal', variant: 'ghost' },
              { text: 'Ganti', variant: 'primary', onClick: () => getUi()?.toast('Kualitas diganti') }
            ]
          })}
      >
        <span class="dot"></span>Dengan tombol
      </button>
      <button
        class="error"
        @click=${() =>
          getUi()?.toast({
            title: 'Hapus riwayat?',
            text: 'Aksi ini tidak bisa dibatalkan.',
            closable: true,
            duration: false,
            actions: [
              { text: 'Batal', variant: 'ghost' },
              {
                text: 'Hapus',
                variant: 'danger',
                onClick: () => getUi()?.toast('Riwayat dihapus')
              }
            ]
          })}
      >
        <span class="dot"></span>Judul + danger
      </button>
    </div>

    <h5>Posisi toast</h5>
    <div class="btn-col">
      <button class="notice" @click=${() => getUi()?.toast({ text: 'Kiri atas', position: 'top-left' })}>
        <span class="dot"></span>Kiri atas
      </button>
      <button class="notice" @click=${() => getUi()?.toast({ text: 'Atas tengah', position: 'top' })}>
        <span class="dot"></span>Atas
      </button>
      <button class="notice" @click=${() => getUi()?.toast({ text: 'Kanan atas', position: 'right' })}>
        <span class="dot"></span>Kanan atas
      </button>
      <button class="notice" @click=${() => getUi()?.toast({ text: 'Tengah layar', position: 'center' })}>
        <span class="dot"></span>Tengah
      </button>
      <button class="notice" @click=${() => getUi()?.toast({ text: 'Kiri bawah', position: 'left-bottom' })}>
        <span class="dot"></span>Kiri bawah
      </button>
      <button class="notice" @click=${() => getUi()?.toast({ text: 'Bawah tengah', position: 'bottom' })}>
        <span class="dot"></span>Bawah
      </button>
      <button
        class="notice"
        @click=${() => getUi()?.toast({ text: 'Kanan bawah', position: 'bottom-right' })}
      >
        <span class="dot"></span>Kanan bawah
      </button>
      <button class="muted" @click=${() => getUi()?.toast.closeAll()}>
        <span class="dot"></span>Tutup semua
      </button>
    </div>
  `,
  document.getElementById('actions')!
)
