import Player, { $, isMobile } from '@nusaplayer/core'
import { screenShot } from '../utils'
import type { ContextMenuItem, UIInterface } from '../types'

const menuCls = $.css({
  position: 'absolute',
  'z-index': 11,
  display: 'none',
  'min-width': '12em',
  padding: '0.3em 0',
  margin: 0,
  'border-radius': '2px',
  'background-color': 'var(--shadow-background-color)',
  color: '#fff',
  'font-size': '0.78em',
  'font-weight': 600,
  'box-shadow': '0 8px 24px rgba(0,0,0,.35)',
  'user-select': 'none',
  'list-style': 'none'
})

const itemCls = $.css({
  display: 'flex',
  'align-items': 'center',
  'justify-content': 'space-between',
  gap: '1.2em',
  padding: '0.55em 0.9em',
  cursor: 'pointer',
  'white-space': 'nowrap',
  '&:hover': {
    'background-color': 'rgba(255,255,255,.12)'
  }
})

const checkedCls = $.css({
  color: 'var(--primary-color)'
})

const disabledCls = $.css({
  opacity: 0.45,
  cursor: 'default',
  '&:hover': { 'background-color': 'transparent' }
})

const sepCls = $.css({
  height: '1px',
  margin: '0.3em 0',
  'background-color': 'rgba(255,255,255,.12)',
  'pointer-events': 'none'
})

function builtins(player: Player, ui: UIInterface): ContextMenuItem[] {
  const { locales, isPlaying, isMuted, isLoop } = player
  const items: ContextMenuItem[] = [
    {
      key: 'play',
      name: locales.get(isPlaying ? 'Pause' : 'Play'),
      onClick: () => {
        player.togglePlay()
      }
    },
    {
      key: 'mute',
      name: locales.get(isMuted ? 'Unmute' : 'Mute'),
      checked: isMuted,
      onClick: () => {
        player.toggleMute()
      }
    },
    {
      key: 'loop',
      name: locales.get('Loop'),
      checked: isLoop,
      onClick: () => player.setLoop(!player.isLoop)
    }
  ]

  if (ui.config.screenshot) {
    items.push({
      key: 'screenshot',
      name: locales.get('Screenshot'),
      onClick: () => screenShot(player)
    })
  }

  if (ui.config.pictureInPicture && player.isPipEnabled) {
    items.push({
      key: 'pip',
      name: locales.get('Picture in Picture'),
      checked: player.isInPip,
      onClick: () => {
        void player.togglePip()
      }
    })
  }

  if (ui.config.fullscreen) {
    items.push({
      key: 'fullscreen',
      name: locales.get('Fullscreen'),
      checked: player.isFullScreen,
      onClick: () => {
        void player.toggleFullScreen()
      }
    })
  }

  items.push(
    { key: 'sep-copy', name: '', separator: true },
    {
      key: 'copy',
      name: locales.get('Copy URL'),
      onClick: async () => {
        const url = player.options.source.src || location.href
        try {
          await navigator.clipboard.writeText(url)
          player.emit('notice', { text: player.locales.get('Copied') })
        } catch {
          player.emit('notice', { text: url })
        }
      }
    }
  )

  return items
}

export default function renderContextMenu(it: UIInterface) {
  const { player, $root, config } = it

  if (config.contextmenu === false || isMobile) return

  const extras: ContextMenuItem[] = Array.isArray(config.contextmenu) ? [...config.contextmenu] : []
  const $menu = $.create(`ul.${menuCls}`, { hidden: '', role: 'menu' })
  let open = false

  function hide() {
    if (!open) return
    open = false
    $menu.hidden = true
    $menu.style.display = 'none'
  }

  function place(clientX: number, clientY: number) {
    const box = $root.getBoundingClientRect()
    $menu.style.display = 'block'
    $menu.hidden = false
    const mw = $menu.offsetWidth
    const mh = $menu.offsetHeight
    let left = clientX - box.left
    let top = clientY - box.top
    if (left + mw > box.width - 8) left = Math.max(8, box.width - mw - 8)
    if (top + mh > box.height - 8) top = Math.max(8, box.height - mh - 8)
    $menu.style.left = `${Math.max(8, left)}px`
    $menu.style.top = `${Math.max(8, top)}px`
  }

  function renderItems() {
    $menu.replaceChildren()
    const rows = [
      ...builtins(player, it),
      ...extras,
      { key: 'sep-about', name: '', separator: true } as ContextMenuItem,
      {
        key: 'about',
        name: `NusaPlayer ${Player.version}`,
        disabled: true
      }
    ]

    for (const row of rows) {
      if (row.hidden) continue
      if (row.separator) {
        $menu.appendChild($.create(`li.${sepCls}`))
        continue
      }
      const $item = $.create(`li.${itemCls}`, { role: 'menuitem' })
      if (row.checked) $item.classList.add(checkedCls)
      if (row.disabled) $item.classList.add(disabledCls)
      $item.appendChild(document.createTextNode(row.name))
      if (row.checked) {
        const mark = $.create('span')
        mark.textContent = '✓'
        $item.appendChild(mark)
      }
      if (!row.disabled) {
        $item.addEventListener('click', (e) => {
          e.stopPropagation()
          void row.onClick?.(player)
          hide()
        })
      }
      $menu.appendChild($item)
    }
  }

  function show(e: MouseEvent) {
    if (player.$root.hasAttribute('data-np-ad')) return
    e.preventDefault()
    e.stopPropagation()
    renderItems()
    open = true
    place(e.clientX, e.clientY)
  }

  function onDocPointer(e: PointerEvent) {
    if (!open || e.button === 2) return
    if ($menu.contains(e.target as Node)) return
    hide()
  }

  function onDocContext(e: Event) {
    if (!open) return
    if (player.$root.contains(e.target as Node)) return
    hide()
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') hide()
  }

  player.$root.addEventListener('contextmenu', show)
  document.addEventListener('pointerdown', onDocPointer)
  document.addEventListener('contextmenu', onDocContext)
  document.addEventListener('keydown', onKey)
  player.on('destroy', () => {
    hide()
    player.$root.removeEventListener('contextmenu', show)
    document.removeEventListener('pointerdown', onDocPointer)
    document.removeEventListener('contextmenu', onDocContext)
    document.removeEventListener('keydown', onKey)
  })

  $.render($menu, $root)
  $menu.addEventListener('click', (e) => e.stopPropagation())
  $menu.addEventListener('pointerdown', (e) => e.stopPropagation())

  it.contextmenu = {
    register(payload) {
      const list = Array.isArray(payload) ? payload : [payload]
      for (const item of list) {
        if (item.key) {
          const i = extras.findIndex((x) => x.key === item.key)
          if (i >= 0) extras.splice(i, 1)
        }
        extras.push(item)
      }
    },
    unregister(key) {
      const i = extras.findIndex((x) => x.key === key)
      if (i >= 0) extras.splice(i, 1)
    }
  }
}
