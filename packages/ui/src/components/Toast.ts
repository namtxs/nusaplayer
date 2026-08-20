import { $ } from '@nusaplayer/core'
import { controllerHidden } from '../style'
import type { NoticePosition, ToastApi, ToastHandle, ToastOptions, UIInterface } from '../types'

const hostCls = $.css({
  position: 'absolute',
  'z-index': 12,
  display: 'flex',
  'flex-direction': 'column',
  gap: '8px',
  'pointer-events': 'none',
  'max-width': 'min(22em, calc(100% - 24px))'
})

const posTop = $.css({
  top: '12px',
  left: '50%',
  transform: 'translateX(-50%)',
  'align-items': 'center',
  'margin-top': 'var(--control-bar-height)',
  transition: 'margin 0.2s',
  [`@global .${controllerHidden} &`]: { 'margin-top': 0 }
})

const posTopLeft = $.css({
  top: '12px',
  left: '12px',
  'align-items': 'flex-start',
  'margin-top': 'var(--control-bar-height)',
  transition: 'margin 0.2s',
  [`@global .${controllerHidden} &`]: { 'margin-top': 0 }
})

const posTopRight = $.css({
  top: '12px',
  right: '12px',
  'align-items': 'flex-end',
  'margin-top': 'var(--control-bar-height)',
  transition: 'margin 0.2s',
  [`@global .${controllerHidden} &`]: { 'margin-top': 0 }
})

const posBottom = $.css({
  bottom: '5.5em',
  left: '50%',
  transform: 'translateX(-50%)',
  'align-items': 'center'
})

const posBottomLeft = $.css({
  bottom: '5.5em',
  left: '12px',
  'align-items': 'flex-start'
})

const posBottomRight = $.css({
  bottom: '5.5em',
  right: '12px',
  'align-items': 'flex-end'
})

const posCenter = $.css({
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  'align-items': 'center'
})

const POS_CLS: Record<NoticePosition, string> = {
  top: posTop,
  'top-center': posTop,
  center: posCenter,
  left: posTopLeft,
  'top-left': posTopLeft,
  right: posTopRight,
  'top-right': posTopRight,
  bottom: posBottom,
  'left-bottom': posBottomLeft,
  'bottom-right': posBottomRight
}

const itemCls = $.css({
  'pointer-events': 'auto',
  display: 'flex',
  'align-items': 'center',
  gap: '12px',
  width: 'max-content',
  'max-width': '100%',
  padding: '8px 12px',
  'border-radius': '4px',
  background: 'rgba(0,0,0,.8)',
  color: '#fff',
  'font-size': '13px',
  'font-weight': 600,
  'line-height': '20px',
  'box-sizing': 'border-box',

  '&[data-layout="stack"]': {
    'flex-direction': 'column',
    'align-items': 'stretch',
    gap: '8px',
    'min-width': '16em',
    padding: '12px 14px'
  }
})

const rowCls = $.css({
  display: 'flex',
  'align-items': 'flex-start',
  gap: '8px',
  width: '100%'
})

const bodyCls = $.css({
  flex: 1,
  'min-width': 0
})

const titleCls = $.css({
  'font-size': '13px',
  'line-height': '18px',
  'margin-bottom': '4px'
})

const textCls = $.css({
  'font-size': '12px',
  'line-height': '18px',
  'font-weight': 500,
  color: 'hsla(0,0%,100%,.88)',
  'word-break': 'break-word'
})

const closeBtnCls = $.css({
  'flex-shrink': 0,
  width: '18px',
  height: '18px',
  padding: 0,
  border: 'none',
  background: 'transparent',
  color: 'hsla(0,0%,100%,.65)',
  cursor: 'pointer',
  'margin-left': '4px',
  '&:hover': { color: '#fff' },
  '& svg': {
    width: '12px',
    height: '12px',
    display: 'block',
    fill: 'currentColor',
    stroke: 'none',
  }
})

const actionsCls = $.css({
  display: 'flex',
  'align-items': 'center',
  'justify-content': 'flex-end',
  'flex-shrink': 0,
  gap: '8px'
})

const actionBtnCls = $.css({
  appearance: 'none',
  border: 'none',
  cursor: 'pointer',
  height: '24px',
  padding: '0 12px',
  'border-radius': '4px',
  'font': 'inherit',
  'font-size': '12px',
  'font-weight': 600,
  'line-height': '24px',
  color: '#fff',
  background: 'hsla(0,0%,100%,.2)',
  '&:hover': { background: 'hsla(0,0%,100%,.28)' },
  '&[data-variant="primary"]': {
    background: 'var(--primary-color)',
    '&:hover': { filter: 'brightness(1.06)' }
  },
  '&[data-variant="ghost"]': {
    background: 'hsla(0,0%,100%,.2)'
  },
  '&[data-variant="danger"]': {
    background: '#d44e54',
    '&:hover': { filter: 'brightness(1.06)' }
  }
})

const CLOSE_ICON =
  '<svg viewBox="0 0 22 22"><path fill="currentColor" d="M16.9 6.35L12 11.25 7.1 6.35 5.7 7.75l4.9 4.9-4.9 4.9 1.4 1.4 4.9-4.9 4.9 4.9 1.4-1.4-4.9-4.9 4.9-4.9z"/></svg>'

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      default:
        return '&#39;'
    }
  })
}

function normalize(options: ToastOptions | string): ToastOptions {
  if (typeof options == 'string') return { text: options }
  return { ...options }
}

let seq = 0

type Entry = {
  id: string
  options: ToastOptions
  $card: HTMLDivElement
  timer?: number
  position: NoticePosition
}

export default function renderToast(it: UIInterface) {
  const { player, $root: el } = it
  const hosts = new Map<NoticePosition, HTMLDivElement>()
  const entries = new Map<string, Entry>()

  function hostFor(position: NoticePosition) {
    let $host = hosts.get(position)
    if ($host) return $host
    $host = $.create(`div.${hostCls}`, {
      'aria-live': 'polite'
    })
    $host.classList.add(POS_CLS[position] || posTop)
    $.render($host, el)
    hosts.set(position, $host)
    return $host
  }

  function clearTimer(entry: Entry) {
    if (entry.timer) {
      window.clearTimeout(entry.timer)
      entry.timer = undefined
    }
  }

  function scheduleHide(entry: Entry) {
    clearTimer(entry)
    const { duration, actions } = entry.options
    const sticky = duration === false || (duration == null && Boolean(actions?.length))
    if (sticky) return
    const ms = typeof duration == 'number' ? duration : 2500
    entry.timer = window.setTimeout(() => close(entry.id), ms)
  }

  function fillCard(entry: Entry) {
    const { $card, options, id } = entry
    const { title, text, html, content, type, closable, className, style, actions } = options
    const stacked = Boolean(title || (actions?.length && (html || content)))
    const showClose = closable === true

    $card.className = `${itemCls}${className ? ` ${className}` : ''}`
    $card.dataset.type = type || ''
    $card.dataset.id = id
    $card.dataset.layout = stacked ? 'stack' : 'inline'

    if (style) {
      Object.assign($card.style, style)
    } else {
      $card.removeAttribute('style')
    }

    $card.replaceChildren()
    $card.onmouseenter = () => clearTimer(entry)
    $card.onmouseleave = () => scheduleHide(entry)

    if (content instanceof HTMLElement) {
      $card.appendChild(content)
    } else if (typeof content == 'string') {
      $card.innerHTML = content
    } else {
      const $row = $.create(`div.${rowCls}`)
      const $body = $.create(`div.${bodyCls}`)
      if (title) {
        const $title = $.create(`div.${titleCls}`)
        $title.textContent = title
        $body.appendChild($title)
      }
      if (html) {
        const $html = $.create(`div.${textCls}`)
        $html.innerHTML = html
        $body.appendChild($html)
      } else if (text) {
        const $text = $.create(`div.${title ? textCls : titleCls}`)
        $text.innerHTML = escapeHtml(text).replace(/\n/g, '<br>')
        $body.appendChild($text)
      }
      $row.appendChild($body)

      if (showClose) {
        const $close = $.create(`button.${closeBtnCls}`, {
          type: 'button',
          'aria-label': 'Close'
        })
        $close.innerHTML = CLOSE_ICON
        $close.addEventListener('click', (e) => {
          e.stopPropagation()
          close(id)
        })
        $row.appendChild($close)
      }

      $card.appendChild($row)
    }

    if (actions?.length) {
      const $actions = $.create(`div.${actionsCls}`)
      actions.forEach((action, index) => {
        const $btn = $.create(`button.${actionBtnCls}`, {
          type: 'button',
          'data-variant': action.variant || (index == actions.length - 1 ? 'primary' : 'ghost')
        })
        $btn.textContent = action.text
        $btn.addEventListener('click', async (e) => {
          e.stopPropagation()
          const result = await action.onClick?.({ close: () => close(id) })
          if (action.close === false || result === false) return
          close(id)
        })
        $actions.appendChild($btn)
      })
      $card.appendChild($actions)
    }
  }

  function close(id?: string) {
    if (!id) return closeAll()
    const entry = entries.get(id)
    if (!entry) return
    clearTimer(entry)
    entry.$card.remove()
    entries.delete(id)
    const $host = hosts.get(entry.position)
    if ($host && !$host.childElementCount) {
      $host.remove()
      hosts.delete(entry.position)
    }
  }

  function closeAll() {
    ;[...entries.keys()].forEach((id) => close(id))
  }

  function show(input: ToastOptions | string): ToastHandle {
    const options = normalize(input)
    const position = options.position || 'top'
    const id = options.id || `toast-${++seq}`

    const existed = entries.get(id)
    if (existed) {
      clearTimer(existed)
      existed.options = { ...existed.options, ...options, id }
      if (existed.position != position) {
        existed.$card.remove()
        existed.position = position
        hostFor(position).appendChild(existed.$card)
      }
      fillCard(existed)
      scheduleHide(existed)
      return { id, close: () => close(id), update }
    }

    const $card = $.create(`div.${itemCls}`, { role: 'status' })
    $card.addEventListener('click', (e) => e.stopPropagation())
    const entry: Entry = { id, options: { ...options, id }, $card, position }
    entries.set(id, entry)
    fillCard(entry)
    hostFor(position).appendChild($card)
    scheduleHide(entry)

    function update(patch: Partial<ToastOptions>) {
      const current = entries.get(id)
      if (!current) return
      show({ ...current.options, ...patch, id })
    }

    return { id, close: () => close(id), update }
  }

  const toast = show as ToastApi
  toast.close = close
  toast.closeAll = closeAll

  player.on('toast', ({ payload }) => show(payload))
  player.on('destroy', closeAll)

  it.toast = toast
  return toast
}
