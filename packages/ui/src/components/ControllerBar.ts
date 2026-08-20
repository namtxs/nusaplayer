import { $, isMobile } from '@nusaplayer/core'
import { Icons } from '../functions/icons'
import { controllerHidden, hidden, icon, off, on, tooltip } from '../style'
import { screenShot } from '../utils'

import type { UIInterface } from '../types'
import { controllers, dropdown, expand, withIcon } from './ControllerBottom.style'
import { arrowSvg } from './Setting'

export const controlBar = $.css({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  'z-index': 7,
  padding: isMobile ? '0.4em 0.3em 0' : '0.5em 0.5em 0',
  transition: 'transform 0.3s ease',
  height: 'var(--control-bar-height)',
  color: '#fff',

  // https://developer.mozilla.org/zh-CN/docs/Web/CSS/env
  //TODO: support display-mode
  // '@media (display-mode: fullscreen)': {
  //   'padding-top': 'constant(safe-area-inset-top)',
  // },

  '&::before': {
    position: 'absolute',
    content: "''",
    width: '100%',
    display: 'block',
    top: 0,
    left: 0,
    bottom: '-1.5em',
    'z-index': -1,
    transition: 'opacity 0.3s ease',
    'pointer-events': 'none',
    'background-image': 'linear-gradient(rgba(0, 0, 0, .55), transparent)'
  },

  '& > div:nth-child(1)': { overflow: 'hidden', flex: '1 1 0', 'margin-right': '0.5em' },

  [`& > div:nth-child(2) .${dropdown}:last-child .${expand}`]: {
    right: 'max(50%,3em)'
  },

  [`@global .${controllerHidden} &`]: {
    transform: 'translateY(calc(-100%))',
    '&::before': { opacity: 0 }
  }
})

const controlBarBackIcon = $.css('width: 2.5em;height: 2.5em;margin:0 -10px;transform: rotate(180deg);')

const controlBarTitle = $.css(
  'flex:1;font-size:1em;font-weight:600;margin: 0 0.25em;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'
)

const render = (it: UIInterface, el: HTMLDivElement) => {
  const { player, config } = it
  const header = config.theme.controller?.header

  if (!header) return

  const back = (header as any)?.back
  const backEnabled = back && isMobile

  const $dom = (it.$controllerBar = $.create(
    'div',
    {
      class: `${controlBar} ${controllers}`
    },
    `<div class="${withIcon}">
    ${
      backEnabled
        ? `<span role='button' class="${controlBarBackIcon} ${back == 'fullscreen' ? hidden : ''}">${arrowSvg(
            ''
          )}</span>`
        : ''
    }
      <h2 class='${controlBarTitle}'>${player.options?.source?.title || ''}</h2>
    </div>
    <div class="${withIcon}">
      ${
        config.screenshot
          ? `<button class="${icon} ${tooltip}" data-tooltip-pos="down" aria-label="${player.locales.get(
              'Screenshot'
            )}">${Icons.get('screenshot')}</button>`
          : ''
      }
      ${
        config.pictureInPicture && player.isPipEnabled
          ? `<button class="${icon} ${tooltip} ${player.isInPip ? on : off}" data-tooltip-pos="down" aria-label="${player.locales.get(
              'Picture in Picture'
            )}">${Icons.get('pip')[0]}${Icons.get('pip')[1]}</button>`
          : ''
      }
      <span data-cluster="settings" class="${withIcon}"></span>
    </div>`
  ))

  const $controlBarTitle = $dom.querySelector<HTMLElement>(`.${controlBarTitle}`)!

  if (backEnabled) {
    const $controlBarBack = $controlBarTitle.previousElementSibling!

    $controlBarBack.addEventListener('click', (e) => {
      if (player.isFullScreen) player.exitFullscreen()
      player.emit('backward', e)
    })

    if (back == 'fullscreen') {
      player.on('fullscreenchange', () => {
        if (player.isFullScreen) {
          $controlBarBack.classList.remove(hidden)
        } else {
          $controlBarBack.classList.add(hidden)
        }
      })
    }
  }

  player.on('videosourcechange', ({ payload }) => {
    if (!payload.then) {
      $controlBarTitle.innerText = payload.title || ''
    }
  })

  player.on('sourcechangeerror', ({ payload }) => {
    if (!payload.source?.title) {
      $controlBarTitle.innerText = (payload.e as Error)?.message || 'ERROR'
    }
  })

  player.on('videosourcechanged', ({ payload }) => {
    $controlBarTitle.innerText = payload.title || ''
  })

  const screenshotLabel = player.locales.get('Screenshot')
  const pipLabel = player.locales.get('Picture in Picture')
  const $pip = $dom.querySelector<HTMLButtonElement>(`button[aria-label="${pipLabel}"]`)

  if ($pip) {
    player.on(['enterpictureinpicture', 'leavepictureinpicture'], () => {
      $pip.classList.add(player.isInPip ? on : off)
      $pip.classList.remove(player.isInPip ? off : on)
    })
  }

  $dom.addEventListener('click', (e: Event) => {
    const label = (e.target as HTMLElement).getAttribute('aria-label')
    if (label == screenshotLabel) screenShot(player)
    if (label == pipLabel) player.togglePip()
  })

  $.render($dom, el)
}

export default render
