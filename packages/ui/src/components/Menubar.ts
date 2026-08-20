import {
  dropdown,
  dropdownHoverable,
  dropItem,
  expand,
  expandBottom,
  textIcon
} from '../components/ControllerBottom.style'
import { icon as iconCls, tooltip } from '../style'
import { isMobile } from '@nusaplayer/core'
import type { MenuBar, UIInterface } from '../types'
import { siblings } from '../utils'

const setChecked = (elm: HTMLElement) => {
  const selected = elm.getAttribute('aria-checked') == 'true'
  elm.setAttribute('aria-checked', `${!selected}`)
  siblings(elm, (it) => it.setAttribute('aria-checked', `${selected}`))
}

function closeDropdowns(root: HTMLElement, except?: Element | null) {
  root.querySelectorAll('[data-open="true"]').forEach((el) => {
    if (el !== except) el.removeAttribute('data-open')
  })
}

export default (it: UIInterface) => {
  const initialState = it.config.menu
  const menus: MenuBar[] = []
  const $top = it.$controllerBar?.lastElementChild as HTMLElement | undefined
  const $end = it.$controllerBottom.lastElementChild as HTMLElement
  const $targets = [$top, $end].filter(Boolean) as HTMLDivElement[]
  const settingsLabel = it.player.locales.get('Settings')

  function clickHandler(e: Event) {
    const elm = (e.target as HTMLElement).closest('[aria-label]') as HTMLElement | null
    if (!elm) return
    const label = elm.getAttribute('aria-label')
    const target = menus.find((it) => it.name == label)

    if (isMobile && elm.tagName.toUpperCase() == 'BUTTON') {
      const wrap = elm.closest('[data-key]') as HTMLElement | null
      if (wrap?.querySelector('[role="menu"]')) {
        const isOpen = wrap.getAttribute('data-open') == 'true'
        closeDropdowns(it.player.$root, isOpen ? null : wrap)
        if (isOpen) wrap.removeAttribute('data-open')
        else wrap.setAttribute('data-open', 'true')
        return
      }
    }

    if (!target || elm.getAttribute('aria-checked') == 'true') return

    if (elm.tagName.toUpperCase() == 'SPAN') {
      setChecked(elm)
      target.onChange?.(
        target.children![+elm.getAttribute('data-index')!]!,
        elm.parentElement!.previousElementSibling as HTMLButtonElement,
        it.player
      )
      elm.closest('[data-open="true"]')?.removeAttribute('data-open')
    } else if (elm.tagName.toUpperCase() == 'BUTTON') {
      target.onClick?.(elm as any, it.player)
    }
  }

  $targets.forEach((it) => {
    it.addEventListener('click', clickHandler)
  })

  if (isMobile) {
    it.player.$root.addEventListener('click', (e) => {
      const node = e.target as HTMLElement
      if (node.closest?.(`.${dropdown}`)) return
      closeDropdowns(it.player.$root)
    })
    it.player.on('controlshidden', () => closeDropdowns(it.player.$root))
  }

  function menuId(menu: MenuBar) {
    return menu.key || menu.name
  }

  function findEl(id: string) {
    for (const parent of $targets) {
      const byKey = parent.querySelector<HTMLElement>(`[data-key="${id}"]`)
      if (byKey) return byKey
      const byName = parent.querySelector<HTMLElement>(`[aria-label="${id}"]`)
      if (byName) return byName.closest('[data-key]') as HTMLElement | null
    }
    return null
  }

  function getSettingsCluster(preferTop: boolean) {
    const clusters = $targets
      .map((el) => el.querySelector<HTMLElement>('[data-cluster="settings"]'))
      .filter(Boolean) as HTMLElement[]

    const withGear = clusters.find((el) => el.querySelector(`button[aria-label="${settingsLabel}"]`))
    if (withGear) return withGear

    if (preferTop && $top) {
      return $top.querySelector<HTMLElement>('[data-cluster="settings"]') || $top
    }
    return ($end.querySelector<HTMLElement>('[data-cluster="settings"]') || $end) as HTMLElement
  }

  function _register(menu: MenuBar) {
    const id = menuId(menu)
    const repeated = menus.find((m) => menuId(m) == id || m.name == menu.name)
    if (repeated) unregister(menuId(repeated))

    const { name, icon, children, position, label } = menu
    let isTop = position == 'top' && $targets.length == 2
    let host: HTMLElement | null = null

    if (isMobile && it.setting && menu.anchor == 'settings' && children?.length && !icon) {
      it.setting.unregister(id)
      it.setting.register({
        key: id,
        name,
        icon: it.icons?.quality,
        type: 'selector',
        children: children.map((child) => ({
          name: child.name,
          value: child.value,
          default: child.default
        })),
        onChange: (item: any) => {
          menu.onChange?.(item, undefined as any, it.player)
        }
      })
      menus.push(menu)
      return
    }

    if (menu.anchor == 'settings') {
      host = getSettingsCluster(isTop)
      isTop = Boolean($top && ($top === host || $top.contains(host)))
    } else if (isTop) {
      host = $top!
    } else {
      host = $end
    }

    const buttonContent = icon || label || name

    const $button = `
    <button
      aria-label="${name}"
      ${isTop ? 'data-tooltip-pos="down"' : ''}
      class="${iconCls} ${!icon ? textIcon : ''} ${!menu.children ? tooltip : ''}"
      type="button"
    >${buttonContent}</button>`

    let $menu: string = ''

    if (menu.children) {
      $menu = `
      <div class="${dropdown} ${dropdownHoverable}" data-key="${id}" data-dropdown-pos="${isTop ? 'top' : ''}" aria-label="${name}">
        ${$button}
        <div class='${expand} ${isTop ? expandBottom : ''}' role='menu'>
          ${children!
            .map(
              (it, i) =>
                `<span
                  role="menuitemradio"
                  aria-haspopup="false"
                  aria-label="${name}"
                  class="${dropItem}"
                  aria-checked="${Boolean(it.default)}"
                  data-index="${i}"
                >${it.name}</span>`
            )
            .join('')}
          </div>
      </div>`
    } else {
      $menu = `<div data-key="${id}">${$button}</div>`
    }

    const wrap = document.createElement('div')
    wrap.innerHTML = $menu.trim()
    const node = wrap.firstElementChild!

    if (menu.anchor == 'settings' && host) {
      const $settings = host.querySelector(`button[aria-label="${settingsLabel}"]`)
      if ($settings) {
        host.insertBefore(node, $settings)
      } else {
        host.appendChild(node)
      }
    } else if (isTop) {
      $top!.insertAdjacentElement('afterbegin', node)
    } else {
      $end.insertAdjacentElement('afterbegin', node)
    }

    menus.push(menu)
  }

  function unregister(name: string) {
    it.setting?.unregister(name)
    const el = findEl(name)
    el?.remove()
    const idx = menus.findIndex((m) => menuId(m) == name || m.name == name)
    if (idx != -1) menus.splice(idx, 1)
  }

  function select(name: string, index: number, shouldBeCallFn: Boolean = true) {
    const el = findEl(name)
    if (!el) {
      it.setting?.select(name, index, shouldBeCallFn)
      return
    }
    const $items = [...el.querySelectorAll<HTMLElement>(`.${expand} > span`)]
    $items.forEach((item, i) => item.setAttribute('aria-checked', `${i === index}`))
    if (shouldBeCallFn) $items[index]?.click()
  }

  function updateLabel(key: string, text: string) {
    const el = findEl(key)
    const $btn = el?.matches('button') ? (el as HTMLButtonElement) : el?.querySelector('button')
    if ($btn) {
      $btn.textContent = text
      return
    }
    it.setting?.updateLabel(key, text)
  }

  if (initialState) initialState.forEach(_register)

  it.menu = {
    register: function (menu: MenuBar | MenuBar[]) {
      ;(Array.isArray(menu) ? menu : [menu]).forEach(_register)
    },
    unregister,
    select,
    updateLabel
  }
}
