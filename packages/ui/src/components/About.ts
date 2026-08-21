import Player, { $, HOMEPAGE } from '@nusaplayer/core'
import type { UIInterface } from '../types'

const wrapCls = $.css({
  position: 'absolute',
  top: '0',
  right: '0',
  bottom: '0',
  left: '0',
  'z-index': 13,
  display: 'none',
  'align-items': 'center',
  'justify-content': 'center',
  background: 'rgba(0,0,0,.55)',
  'pointer-events': 'auto'
})

const cardCls = $.css({
  width: 'min(20em, calc(100% - 2em))',
  padding: '1.35em 1.25em 1.15em',
  'border-radius': '8px',
  'background-color': 'var(--shadow-background-color)',
  color: '#fff',
  'text-align': 'center',
  'box-shadow': '0 12px 40px rgba(0,0,0,.45)'
})

const titleCls = $.css({
  margin: 0,
  'font-size': '1.15em',
  'font-weight': 700,
  color: 'var(--primary-color)'
})

const verCls = $.css({
  margin: '0.35em 0 0',
  'font-size': '0.78em',
  'font-weight': 600,
  color: 'rgba(255,255,255,.65)'
})

const linkCls = $.css({
  display: 'inline-block',
  margin: '0.9em 0 0',
  color: '#fff',
  'font-size': '0.78em',
  'font-weight': 600,
  'text-decoration': 'underline',
  'text-underline-offset': '0.2em',
  '&:hover': { color: 'var(--primary-color)' }
})

const closeCls = $.css({
  display: 'block',
  margin: '1em auto 0',
  padding: '0.4em 1.1em',
  border: 'none',
  'border-radius': '4px',
  background: 'var(--primary-color)',
  color: '#fff',
  cursor: 'pointer',
  font: 'inherit',
  'font-size': '0.78em',
  'font-weight': 700
})

export default function renderAbout(it: UIInterface) {
  const { player, $root } = it
  const $wrap = $.create(`div.${wrapCls}`, { hidden: '', role: 'dialog', 'aria-label': 'About NusaPlayer' })
  const $card = $.create(`div.${cardCls}`)
  const $title = $.create(`p.${titleCls}`)
  $title.textContent = 'NusaPlayer'
  const $ver = $.create(`p.${verCls}`)
  $ver.textContent = `v${Player.version}`
  const $link = $.create(`a.${linkCls}`, {
    href: HOMEPAGE,
    target: '_blank',
    rel: 'noopener noreferrer'
  })
  $link.textContent = 'github.com/namtxs/nusaplayer'
  const $close = $.create(`button.${closeCls}`, { type: 'button' })
  $close.textContent = player.locales.get('Close')

  $card.appendChild($title)
  $card.appendChild($ver)
  $card.appendChild($link)
  $card.appendChild($close)
  $wrap.appendChild($card)
  $.render($wrap, $root)

  function hide() {
    $wrap.hidden = true
    $wrap.style.display = 'none'
  }

  function show() {
    $wrap.hidden = false
    $wrap.style.display = 'flex'
  }

  $wrap.addEventListener('click', (e) => {
    if (e.target === $wrap) hide()
  })
  $card.addEventListener('click', (e) => e.stopPropagation())
  $close.addEventListener('click', hide)
  player.on('destroy', hide)

  return { show, hide }
}
