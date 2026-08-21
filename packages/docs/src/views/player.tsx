import React, { useCallback, useEffect, useRef, useState } from 'react'
import Player, { PlayerPlugin } from '@nusaplayer/core'
import ui from '@nusaplayer/ui'
import hls from '@nusaplayer/hls'
import dash from '@nusaplayer/dash'
import shaka from '@nusaplayer/shaka'
import mpegts from '@nusaplayer/mpegts'
import torrent from '@nusaplayer/torrent'
import Danmaku from '@nusaplayer/danmaku'
import { Chromecast } from '@nusaplayer/plugins'
import { DEMO, SAMPLE_SOURCES } from '../samples'
import style from './player.module.scss'

const userPreferencesPlugin: PlayerPlugin = {
  name: 'userPreferencesPlugin',
  apply(player) {
    player.on('ratechange', () => {
      if (!player.isSourceChanging) {
        localStorage.setItem('@nusaplayer/UserPreferences/speed', player.playbackRate.toString())
      }
    })
    player.on('volumechange', () => {
      localStorage.setItem('@nusaplayer/UserPreferences/volume', player.volume.toString())
    })
  }
}

function storedRate() {
  const value = Number(localStorage.getItem('@nusaplayer/UserPreferences/speed'))
  return Number.isFinite(value) && value > 0 ? value : 1
}

function storedVolume() {
  const value = Number(localStorage.getItem('@nusaplayer/UserPreferences/volume'))
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 1
}

export default function StreamTester() {
  const player = useRef<Player>()
  const mountRef = useRef<HTMLDivElement>(null)
  const createGen = useRef(0)
  const [input, setInput] = useState<string>(DEMO.mp4)
  const [format, setFormat] = useState<string>('auto')
  const [active, setActive] = useState('mp4')
  const [busy, setBusy] = useState(false)

  const createPlayer = useCallback(async (src: string, fmt: string, sampleId?: string) => {
    const el = mountRef.current
    if (!el || !src.trim()) return

    const gen = ++createGen.current
    const prev = player.current
    player.current = undefined
    setBusy(true)
    try {
      await prev?.destroy()
      if (gen !== createGen.current || mountRef.current !== el) return

      const sample = SAMPLE_SOURCES.find((item) => item.id === sampleId)
      const isOceans = src === DEMO.mp4 || sampleId === 'mp4'

      player.current = Player.make(el, {
        source: {
          src: src.trim(),
          format: fmt === 'auto' ? undefined : fmt,
          title: sample?.title ?? 'NusaPlayer',
          poster: sample?.poster ?? (isOceans ? DEMO.poster : undefined)
        },
        playbackRate: storedRate(),
        volume: storedVolume()
      })
        .use([
          ui({
            theme: { primaryColor: '#fb7299' },
            keyboard: { global: true },
            screenshot: true,
            pictureInPicture: true,
            highlight: isOceans
              ? {
                  source: [
                    { time: 4, text: 'Intro' },
                    { time: 14, text: 'Plugins' },
                    { time: 29, text: 'Keyboard' }
                  ]
                }
              : undefined,
            subtitle: isOceans
              ? {
                  source: [
                    { name: 'English', default: true, src: DEMO.enSrt },
                    { name: 'English (styled)', src: DEMO.styledVtt },
                    { name: 'Indonesia', src: DEMO.idSrt }
                  ]
                }
              : undefined
          }),
          shaka(),
          hls({ forceHLS: true }),
          dash(),
          mpegts(),
          torrent({ library: 'https://cdn.jsdelivr.net/npm/webtorrent@0.98.18/webtorrent.min.js' }),
          new Danmaku({
            enable: true,
            displaySender: true,
            source: isOceans ? DEMO.danmaku : undefined
          }),
          userPreferencesPlugin,
          new Chromecast()
        ])
        .create()
    } finally {
      if (gen === createGen.current) setBusy(false)
    }
  }, [])

  useEffect(() => {
    createPlayer(DEMO.mp4, 'auto', 'mp4')
    return () => {
      createGen.current++
      player.current?.destroy()
      player.current = undefined
    }
  }, [createPlayer])

  const playInput = () => {
    if (input.trim()) createPlayer(input, format, active || undefined)
  }

  return (
    <div className={style.container}>
      <p className={style.lead}>
        Oceans includes subtitles and danmaku. Code: <a href="/playground/">Playground</a>.
      </p>
      <div className={style.samples}>
        {SAMPLE_SOURCES.map((sample) => (
          <button
            key={sample.id}
            type="button"
            className={active === sample.id ? `${style.chip} ${style.chipOn}` : style.chip}
            disabled={busy}
            onClick={() => {
              setActive(sample.id)
              setInput(sample.src)
              setFormat(sample.format)
              createPlayer(sample.src, sample.format, sample.id)
            }}
          >
            {sample.label}
          </button>
        ))}
      </div>
      <div className={style.form}>
        <input
          required
          type="text"
          placeholder="https://example.com/index.m3u8"
          value={input}
          disabled={busy}
          onChange={(e) => {
            setInput(e.target.value)
            setActive('')
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              playInput()
            }
          }}
        />
        <select name="format" value={format} disabled={busy} onChange={(e) => setFormat(e.target.value)}>
          <option value="auto">auto</option>
          <option value="hls">hls</option>
          <option value="dash">dash</option>
          <option value="flv">flv</option>
          <option value="shaka">shaka</option>
        </select>
        <button type="button" disabled={busy || !input.trim()} onClick={playInput}>
          {busy ? 'Loading' : 'Play'}
        </button>
      </div>
      <p className={style.tips}>
        HTTPS + CORS are required for HLS, DASH, and FLV. Native MP4 plays without extra loaders.
      </p>
      <div ref={mountRef} className={style.stage} aria-busy={busy} />
    </div>
  )
}
