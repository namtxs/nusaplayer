import type { Player } from '@nusaplayer/core'
import { isFocused } from '../listeners/focus'
import { webFullScreen, locked } from '../style'
import { UIInterface } from '../types'
import { formatTime, screenShot } from '../utils'
import { isMobile } from '@nusaplayer/core'

const VOLUME_SETUP = 10
const SEEK_SETUP = 5

const KEY_FN: Record<string, (player: Player, config: UIInterface['config']) => void> = {
  ARROWUP: (player: Player) => {
    const nextVolume = player.volume * 100 + VOLUME_SETUP
    player.setVolume(nextVolume / 100)
    player.emit('notice', { id: 'hud-volume', text: player.locales.get('Volume: %s', `${~~(player.volume * 100)}%`) })
  },
  ARROWDOWN: (player: Player) => {
    const nextVolume = player.volume * 100 - VOLUME_SETUP
    player.setVolume(nextVolume / 100)
    player.emit('notice', { id: 'hud-volume', text: player.locales.get('Volume: %s', `${~~(player.volume * 100)}%`) })
  },

  ARROWLEFT: (player: Player, config) => {
    if (player.options.isLive || player.hasError) return
    const step = config.theme.progress?.backward || SEEK_SETUP
    const tar = Math.max(0, player.currentTime - step)
    player.seek(tar)

    player.emit('notice', {
      id: 'hud-seek',
      text: `${formatTime(player.currentTime)} / ${formatTime(player.duration)}`
    })
  },
  ARROWRIGHT: (player: Player) => {
    if (player.options.isLive || player.hasError) return
    player.seek(player.currentTime + SEEK_SETUP)

    player.emit('notice', {
      id: 'hud-seek',
      text: `${formatTime(player.currentTime)} / ${formatTime(player.duration)}`
    })
  },

  ' ': (player: Player) => player.togglePlay(),
  K: (player: Player) => player.togglePlay(),

  ESCAPE: (player: Player) => {
    if (player.isFullScreen) {
      player.exitFullscreen()
    } else if (player.$root.classList.contains(webFullScreen)) {
      player.emit('fullscreenchange', { isWeb: true })
    }
  },

  F: (player: Player) => player.toggleFullScreen(),

  W: (player: Player) => player.emit('fullscreenchange', { isWeb: true }),

  S: screenShot,

  M: (player: Player) => (player.isMuted ? player.unmute() : player.mute())
}

export default function (it: UIInterface) {
  const { player, config } = it

  if (isMobile && !config.keyboard?.focused && !config.keyboard?.global) {
    return
  }

  function keydown(e: KeyboardEvent) {
    if (
      document.activeElement?.tagName == 'INPUT' ||
      document.activeElement?.tagName == 'TEXTAREA' ||
      document.activeElement?.getAttribute('contenteditable') ||
      (config.keyboard!.focused && !isFocused(player)) ||
      player.$root.classList.contains(locked) ||
      e.altKey ||
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey
    ) {
      return
    }

    const key = e.key.toLocaleUpperCase()

    if (KEY_FN[key]) {
      e.preventDefault()
      KEY_FN[key]!(player, config)
    }
  }

  it.keyboard = {
    register: function register(payload: any) {
      for (const key in payload) {
        if (Object.prototype.hasOwnProperty.call(payload, key)) {
          KEY_FN[key.toLocaleUpperCase()] = payload[key]
        }
      }
    },
    unregister: function unregister(payload: string[]) {
      payload.forEach((k) => {
        delete KEY_FN[k]
      })
    }
  }

  document.addEventListener('keydown', keydown)
  player.on('destroy', () => {
    document.removeEventListener('keydown', keydown)
  })
}
