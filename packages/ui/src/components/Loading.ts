import type { Player } from '@nusaplayer/core'
import { $ } from '@nusaplayer/core'
import { Icons } from '../functions'
import { line, wrap } from './Loading.style'

const render = (_: Player, el: HTMLElement) => {
  const $dom = $.create(
    `div.${wrap}`,
    { 'aria-label': 'Loading' },
    `${Icons.get('loadingIndicator') || `<div class="${line}"></div>`}`
  )

  $.render($dom, el)
}

export default render
