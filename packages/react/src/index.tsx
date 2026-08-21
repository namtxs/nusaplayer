import type { PlayerEvent, PlayerOptions, PlayerPlugin, Source } from '@nusaplayer/core'
import Player from '@nusaplayer/core'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type Ref
} from 'react'

export interface ReactNusaPlayerProps extends Omit<PlayerOptions, 'source'> {
  playing?: boolean
  duration?: number
  aspectRatio?: number
  plugins?: PlayerPlugin[]
  onEvent?: (e: PlayerEvent) => void
  source?: Source | Source[] | Promise<Source | Source[]>
}

const ReactNusaPlayer = forwardRef((props: ReactNusaPlayerProps, ref: Ref<Player | null>) => {
  const { playing, duration, aspectRatio = 9 / 16, plugins = [], onEvent, source, ...rest } = props

  const hostRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<Player | null>(null)
  const onEventRef = useRef(onEvent)
  const pluginsRef = useRef(plugins)
  const restRef = useRef(rest)
  const sourceRef = useRef(source)
  const preSource = usePrevious(source)
  const [ready, setReady] = useState(false)

  onEventRef.current = onEvent
  pluginsRef.current = plugins
  restRef.current = rest
  sourceRef.current = source

  useEffect(() => {
    const node = hostRef.current
    if (!node) return

    let cancelled = false
    const initialSource = sourceRef.current
    const initialRest = restRef.current
    const initialParams =
      initialSource instanceof Promise
        ? initialRest
        : initialSource
          ? { ...initialRest, source: initialSource }
          : initialRest

    const instance = Player.make(node, initialParams).use(pluginsRef.current).create()
    if (cancelled) {
      void instance.destroy()
      return
    }

    playerRef.current = instance
    if (initialSource instanceof Promise) instance.changeSource(initialSource)
    instance.on((payload: PlayerEvent) => onEventRef.current?.(payload))
    setReady(true)

    return () => {
      cancelled = true
      setReady(false)
      playerRef.current = null
      void instance.destroy()
    }
  }, [])

  useEffect(() => {
    if (!ready || typeof playing !== 'boolean') return
    const player = playerRef.current
    if (!player) return
    if (playing) {
      if (!player.isPlaying) player.play()
    } else if (player.isPlaying) {
      player.pause()
    }
  }, [ready, playing])

  useEffect(() => {
    if (!ready || !source) return
    const player = playerRef.current
    if (!player) return
    const changed =
      source instanceof Promise
        ? preSource != source
        : sourceKey(source) !== sourceKey(preSource as Source | Source[] | undefined)
    if (changed) player.changeSource(source)
  }, [ready, source, preSource])

  useEffect(() => {
    if (!ready || typeof duration !== 'number') return
    playerRef.current?.seek(duration / 1000)
  }, [ready, duration])

  useEffect(() => {
    if (!ready) return
    const player = playerRef.current
    if (!player) return
    if (rest.muted) player.mute()
    else player.unmute()
  }, [ready, rest.muted])

  useEffect(() => {
    if (!ready || typeof rest.playbackRate !== 'number') return
    playerRef.current?.setPlaybackRate(rest.playbackRate)
  }, [ready, rest.playbackRate])

  useImperativeHandle(ref, () => playerRef.current, [ready])

  const shell = useMemo(() => {
    if (aspectRatio == 0) {
      return <div ref={hostRef} />
    }

    return (
      <div
        style={{
          width: '100%',
          paddingTop: `${aspectRatio * 100}%`,
          backgroundColor: '#f4f4f4',
          position: 'relative'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
          ref={hostRef}
        />
      </div>
    )
  }, [])

  return shell
})

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

function sourceKey(source?: Source | Source[]) {
  if (!source) return ''
  if (Array.isArray(source)) return source.map((item) => item.src).join('\n')
  return source.src
}

export * from '@nusaplayer/core'

export default ReactNusaPlayer
