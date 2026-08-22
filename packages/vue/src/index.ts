import type { PlayerEvent, PlayerOptions, PlayerPlugin, Source } from '@nusaplayer/core'
import Player from '@nusaplayer/core'
import { defineComponent, h, onBeforeUnmount, onMounted, ref, shallowRef, watch, type PropType } from 'vue'

export interface VueNusaPlayerProps extends Omit<PlayerOptions, 'source'> {
  playing?: boolean
  duration?: number
  aspectRatio?: number
  plugins?: PlayerPlugin[]
  onEvent?: (e: PlayerEvent) => void
  source?: Source | Source[] | Promise<Source | Source[]>
}

export type VueNusaPlayerInstance = {
  player: Player | null
}

function sourceKey(source?: Source | Source[] | Promise<Source | Source[]>) {
  if (!source) return ''
  if (source instanceof Promise) return source
  if (Array.isArray(source)) return source.map((item) => item.src).join('\n')
  return source.src
}

function toOptions(props: VueNusaPlayerProps): PlayerOptions {
  const options: PlayerOptions = {}
  const keys = [
    'autoplay',
    'autopause',
    'muted',
    'loop',
    'volume',
    'playbackRate',
    'playsinline',
    'preload',
    'lang',
    'languages',
    'isLive',
    'videoAttr',
    'isNativeUI'
  ] as const
  for (const key of keys) {
    const value = props[key]
    if (value !== undefined) (options as Record<string, unknown>)[key] = value
  }
  if (props.source && !(props.source instanceof Promise)) options.source = props.source
  return options
}

export const VueNusaPlayer = defineComponent({
  name: 'NusaPlayer',
  props: {
    playing: { type: Boolean, default: undefined },
    duration: Number,
    aspectRatio: { type: Number, default: 9 / 16 },
    plugins: { type: Array as PropType<PlayerPlugin[]>, default: () => [] },
    onEvent: { type: Function as PropType<(e: PlayerEvent) => void> },
    source: { type: [Object, Array] as PropType<Source | Source[] | Promise<Source | Source[]>> },
    autoplay: Boolean,
    autopause: Boolean,
    muted: Boolean,
    loop: Boolean,
    volume: Number,
    playbackRate: Number,
    playsinline: Boolean,
    preload: String as PropType<PlayerOptions['preload']>,
    lang: String as PropType<PlayerOptions['lang']>,
    languages: Object as PropType<PlayerOptions['languages']>,
    isLive: Boolean,
    videoAttr: Object as PropType<PlayerOptions['videoAttr']>,
    isNativeUI: Function as PropType<PlayerOptions['isNativeUI']>
  },
  setup(props, { expose }) {
    const hostRef = ref<HTMLDivElement | null>(null)
    const playerRef = shallowRef<Player | null>(null)
    const ready = ref(false)
    let onEventFn = props.onEvent

    watch(
      () => props.onEvent,
      (fn) => {
        onEventFn = fn
      }
    )

    onMounted(() => {
      const node = hostRef.value
      if (!node) return

      const instance = Player.make(node, toOptions(props)).use(props.plugins ?? []).create()
      playerRef.value = instance
      if (props.source instanceof Promise) instance.changeSource(props.source)
      instance.on((payload: PlayerEvent) => onEventFn?.(payload))
      ready.value = true
    })

    onBeforeUnmount(() => {
      const instance = playerRef.value
      ready.value = false
      playerRef.value = null
      if (instance) void instance.destroy()
    })

    watch(
      () => [ready.value, props.playing] as const,
      () => {
        if (!ready.value || typeof props.playing !== 'boolean') return
        const player = playerRef.value
        if (!player) return
        if (props.playing) {
          if (!player.isPlaying) void player.play()
        } else if (player.isPlaying) {
          player.pause()
        }
      }
    )

    watch(
      () => props.source,
      (source, prev) => {
        if (!ready.value || !source) return
        const player = playerRef.value
        if (!player) return
        if (sourceKey(source) !== sourceKey(prev)) player.changeSource(source)
      }
    )

    watch(
      () => [ready.value, props.duration] as const,
      () => {
        if (!ready.value || typeof props.duration !== 'number') return
        playerRef.value?.seek(props.duration / 1000)
      }
    )

    watch(
      () => [ready.value, props.muted] as const,
      () => {
        if (!ready.value) return
        const player = playerRef.value
        if (!player) return
        if (props.muted) player.mute()
        else player.unmute()
      }
    )

    watch(
      () => [ready.value, props.playbackRate] as const,
      () => {
        if (!ready.value || typeof props.playbackRate !== 'number') return
        playerRef.value?.setPlaybackRate(props.playbackRate)
      }
    )

    expose({
      get player() {
        return playerRef.value
      }
    } satisfies VueNusaPlayerInstance)

    return () => {
      const ratio = props.aspectRatio ?? 9 / 16
      if (ratio === 0) {
        return h('div', { ref: hostRef })
      }

      return h(
        'div',
        {
          style: {
            width: '100%',
            paddingTop: `${ratio * 100}%`,
            backgroundColor: '#f4f4f4',
            position: 'relative'
          }
        },
        [
          h('div', {
            ref: hostRef,
            style: {
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%'
            }
          })
        ]
      )
    }
  }
})

export default VueNusaPlayer

export * from '@nusaplayer/core'
