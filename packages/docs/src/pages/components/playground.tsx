import React, { Component, useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { LiveError, LivePreview, LiveProvider } from 'react-live'
import Player from '@nusaplayer/react'
import ui from '@nusaplayer/ui'
import hls from '@nusaplayer/hls'
import dash from '@nusaplayer/dash'
import mpegts from '@nusaplayer/mpegts'
import torrent from '@nusaplayer/torrent'
import shaka from '@nusaplayer/shaka'
import Danmaku from '@nusaplayer/danmaku'
import { AirPlay, Chromecast, Playlist } from '@nusaplayer/plugins'
import { PLAYGROUND_SAMPLES, toLiveCode } from './playground.samples'
import { CodeEditor } from './playground-editor'
import style from './playground.module.scss'

const scope = {
  React,
  Player,
  ui,
  hls,
  dash,
  mpegts,
  torrent,
  shaka,
  Danmaku,
  Playlist,
  Chromecast,
  AirPlay
}

class PreviewBoundary extends Component<{ resetKey: number; children: React.ReactNode }, { error?: Error }> {
  state: { error?: Error } = {}

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidUpdate(prevProps: { resetKey: number }) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: undefined })
    }
  }

  render() {
    if (this.state.error) {
      return <pre className={style.error}>{this.state.error.message}</pre>
    }
    return this.props.children
  }
}

export default function CodePlayground() {
  const [ready, setReady] = useState(false)
  const [sampleId, setSampleId] = useState(PLAYGROUND_SAMPLES[0]!.id)
  const [draft, setDraft] = useState(PLAYGROUND_SAMPLES[0]!.code)
  const [running, setRunning] = useState(PLAYGROUND_SAMPLES[0]!.code)
  const [runKey, setRunKey] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  const sample = PLAYGROUND_SAMPLES.find((item) => item.id === sampleId) ?? PLAYGROUND_SAMPLES[0]!

  const loadSample = (id: string) => {
    const next = PLAYGROUND_SAMPLES.find((item) => item.id === id)
    if (!next) return
    setSampleId(next.id)
    setDraft(next.code)
    setRunning(next.code)
    setRunKey((key) => key + 1)
  }

  const run = useCallback(() => {
    setRunning(draft)
    setRunKey((key) => key + 1)
  }, [draft])

  const reset = () => {
    setDraft(sample.code)
    setRunning(sample.code)
    setRunKey((key) => key + 1)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(draft)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      setCopied(false)
    }
  }

  const liveCode = useMemo(() => toLiveCode(running), [running])

  if (!ready) {
    return <div className={style.placeholder}>Loading playground…</div>
  }

  return (
    <div className={style.wrap}>
      <p className={style.lead}>
        Imports resolve to packages on this site. <Link href="/player/">Streams</Link> for raw URLs.
      </p>
      <div className={style.toolbar}>
        {PLAYGROUND_SAMPLES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === sampleId ? `${style.chip} ${style.chipOn}` : style.chip}
            onClick={() => loadSample(item.id)}
          >
            {item.label}
          </button>
        ))}
        <span className={style.spacer} />
        <button type="button" className={style.action} onClick={copy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button type="button" className={style.action} onClick={reset}>
          Reset
        </button>
        <button type="button" className={style.actionPrimary} onClick={run}>
          Run
        </button>
      </div>
      <div className={style.grid}>
        <div className={style.pane}>
          <div className={style.paneHead}>
            <span>App.tsx</span>
            <span>Ctrl + Enter</span>
          </div>
          <CodeEditor value={draft} onChange={setDraft} onRun={run} />
        </div>
        <div className={style.pane}>
          <div className={`${style.paneHead} ${style.previewHead}`}>
            <span>Preview</span>
          </div>
          <LiveProvider
            key={runKey}
            noInline
            enableTypeScript
            language="tsx"
            code={liveCode}
            scope={scope}
          >
            <PreviewBoundary resetKey={runKey}>
              <div className={style.preview}>
                <LivePreview />
              </div>
            </PreviewBoundary>
            <LiveError className={style.error} />
          </LiveProvider>
        </div>
      </div>
      <p className={style.hint}>
        In scope: Player, ui, hls, dash, mpegts, torrent, shaka, Danmaku, Playlist, Chromecast, AirPlay.
      </p>
    </div>
  )
}
