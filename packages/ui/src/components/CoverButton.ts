import type Player from '@nusaplayer/core'
import { $, isMobile } from '@nusaplayer/core'
import rewindSvg from '../icons/rewind.svg?raw'
import forwardSvg from '../icons/forward.svg?raw'
import lockSvg from '../icons/lock.svg?raw'
import unlockSvg from '../icons/unlock.svg?raw'
import overlayPlaySvg from '../icons/overlay-play.svg?raw'
import overlayPauseSvg from '../icons/overlay-pause.svg?raw'
import { formatTime } from '../utils'
import {
  icon,
  playing,
  loading,
  controllerHidden,
  error,
  locked,
  DATA_CONTROLLER_HIDDEN,
  on,
  off
} from '../style'

const SEEK_STEP = 10

const hidden = {
  opacity: 0,
  'pointer-events': 'none'
}

const layer = $.css({
  position: 'absolute',
  inset: '0',
  'z-index': '7',
  display: 'flex',
  'align-items': 'center',
  'justify-content': 'center',
  'pointer-events': 'none',
  fill: 'currentColor',
  color: '#fff'
})

const cluster = $.css(
  Object.assign(
    {
      display: 'flex',
      'align-items': 'center',
      gap: isMobile ? '1.6em' : '5.1em',
      'pointer-events': 'auto',
      transition: 'opacity 120ms linear',

      [`@global .${playing}.${controllerHidden} &`]: hidden,
      [`@global .${loading} &`]: hidden,
      [`@global .${error} &`]: hidden,
      [`@global .${locked} &`]: hidden,
      '@media (max-width: 400px)': {
        gap: '1.15em'
      }
    },
    isMobile && {
      [`@global .${controllerHidden} &`]: hidden
    }
  )
)

const roundBtn = $.css({
  width: '4.1em',
  height: '4.1em',
  'border-radius': '100%',
  background: 'rgba(0, 0, 0, 0.5)',
  'box-shadow': 'none',
  display: 'inline-flex',
  'align-items': 'center',
  'justify-content': 'center',
  padding: '0',
  transition: 'transform .2s ease-in-out, background .2s ease',
  '&:hover': { background: 'rgba(0, 0, 0, 0.66)' },
  '&:active': { transform: 'scale(.92)' },
  '& > *': { 'pointer-events': 'none' },
  '& > svg': {
    width: '2.1em',
    height: '2.1em',
    display: 'block',
    fill: 'currentColor',
    stroke: 'none'
  }
})

const seekBtn = $.css({
  width: isMobile ? '3.15em' : '3.45em',
  height: isMobile ? '3.15em' : '3.45em',
  background: 'rgba(0, 0, 0, 0.5)',
  'box-shadow': 'none',
  '&:hover': { background: 'rgba(0, 0, 0, 0.66)' },
  '& > svg': {
    width: '1.7em',
    height: '1.7em'
  }
})

const playBtn = $.css({
  width: isMobile ? '4.4em' : '5em',
  height: isMobile ? '4.4em' : '5em',
  'border-radius': '0',
  background: 'transparent',
  'box-shadow': 'none',
  display: 'inline-flex',
  'align-items': 'center',
  'justify-content': 'center',
  padding: '0',
  transition: 'transform .2s ease-in-out, filter .2s ease',
  '&:hover': {
    background: 'transparent',
    filter: 'brightness(1.08)'
  },
  '&:active': { transform: 'scale(.92)' },
  '& > *': { 'pointer-events': 'none' },
  '& > svg': {
    width: '100%',
    height: '100%',
    display: 'block',
    fill: 'currentColor',
    stroke: 'none',
    filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.35))'
  }
})

const lockBtn = $.css(
  Object.assign(
    {
      position: 'absolute',
      left: isMobile ? '0.4em' : '0.75em',
      top: '50%',
      transform: 'translateY(-50%)',
      'pointer-events': 'auto',
      width: '2.2em',
      height: '2.2em',
      'border-radius': '100%',
      background: 'rgba(0, 0, 0, 0.5)',
      'box-shadow': 'none',
      display: 'inline-flex',
      'align-items': 'center',
      'justify-content': 'center',
      padding: '0',
      transition: 'opacity 120ms linear, background .2s ease, transform .2s ease-in-out',
      '&:hover': { background: 'rgba(0, 0, 0, 0.66)' },
      '&:active': { transform: 'translateY(-50%) scale(.92)' },
      '& > *': { 'pointer-events': 'none' },
      '& > svg': {
        width: '1.15em',
        height: '1.15em',
        display: 'block',
        fill: 'currentColor',
        stroke: 'none'
      },
      [`@global .${playing}.${controllerHidden}:not(.${locked}) &`]: hidden,
      [`@global .${locked} &`]: {
        opacity: 0,
        'pointer-events': 'none'
      },
      [`@global .${locked}:hover &`]: {
        opacity: 1,
        'pointer-events': 'auto'
      },
      [`@global .${loading} &`]: hidden,
      [`@global .${error} &`]: hidden
    },
    isMobile && {
      [`@global .${controllerHidden}:not(.${locked}) &`]: hidden,
      [`@global .${locked} &`]: {
        opacity: 1,
        'pointer-events': 'auto'
      }
    }
  )
)

const seekBy = (player: Player, delta: number) => {
  if (player.options.isLive || player.hasError) return
  const duration = Number.isFinite(player.duration) ? player.duration : player.currentTime + delta
  const next = Math.min(duration, Math.max(0, player.currentTime + delta))
  player.seek(next)
  player.emit('notice', {
    id: 'hud-seek',
    text: `${formatTime(player.currentTime)} / ${formatTime(player.duration)}`
  })
}

const render = (player: Player, el: HTMLElement) => {
  const rewindLabel = player.locales.get('Rewind %ss', SEEK_STEP)
  const forwardLabel = player.locales.get('Forward %ss', SEEK_STEP)
  const playLabel = player.locales.get('Play')
  const pauseLabel = player.locales.get('Pause')
  const lockLabel = player.locales.get('Lock')
  const unlockLabel = player.locales.get('Unlock')
  const canSeek = !player.options.isLive

  const $dom = $.create(
    `div.${layer}`,
    {},
    `<button class="${icon} ${lockBtn} ${off}" type="button" aria-label="${lockLabel}">
      ${lockSvg}
      ${unlockSvg}
    </button>
    <div class="${cluster}">
      ${
        canSeek
          ? `<button class="${icon} ${roundBtn} ${seekBtn}" type="button" aria-label="${rewindLabel}">
              ${rewindSvg}
            </button>`
          : ''
      }
      <button class="${icon} ${playBtn} ${player.isPlaying ? on : off}" type="button" aria-label="${playLabel}">
        ${overlayPlaySvg}
        ${overlayPauseSvg}
      </button>
      ${
        canSeek
          ? `<button class="${icon} ${roundBtn} ${seekBtn}" type="button" aria-label="${forwardLabel}">
              ${forwardSvg}
            </button>`
          : ''
      }
    </div>`
  )

  const $lock = $dom.querySelector<HTMLButtonElement>(`button[aria-label="${lockLabel}"]`)!
  const $play = $dom.querySelector<HTMLButtonElement>(`button[aria-label="${playLabel}"]`)!

  const switcher = (el: HTMLElement, display: boolean) => {
    el.classList.add(display ? on : off)
    el.classList.remove(display ? off : on)
  }

  const setLocked = (next: boolean) => {
    player.$root.classList.toggle(locked, next)
    $lock.setAttribute('aria-label', next ? unlockLabel : lockLabel)
    switcher($lock, next)
    if (next) {
      player.$root.classList.add(controllerHidden)
      player.$root.setAttribute(DATA_CONTROLLER_HIDDEN, 'true')
      player.emit('controlshidden', false)
      player.emit('notice', { id: 'hud-lock', text: lockLabel })
    } else {
      player.$root.classList.remove(controllerHidden)
      player.$root.setAttribute(DATA_CONTROLLER_HIDDEN, 'false')
      player.emit('controlsshown', true)
      player.emit('notice', { id: 'hud-lock', text: unlockLabel })
    }
  }

  player.on(['play', 'pause', 'videosourcechange'], () => {
    $play.setAttribute('aria-label', player.isPlaying ? pauseLabel : playLabel)
    switcher($play, player.isPlaying)
  })

  $dom.addEventListener('click', (e) => {
    const label = (e.target as HTMLElement).closest('button')?.getAttribute('aria-label')
    switch (label) {
      case playLabel:
      case pauseLabel:
        player.togglePlay()
        break
      case rewindLabel:
        seekBy(player, -SEEK_STEP)
        break
      case forwardLabel:
        seekBy(player, SEEK_STEP)
        break
      case lockLabel:
        setLocked(true)
        break
      case unlockLabel:
        setLocked(false)
        break
      default:
        break
    }
  })

  $.render($dom, el)
  return $dom
}

export default render
