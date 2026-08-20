import type { Lang } from '@nusaplayer/core'
import type { Setting, UIInterface } from '../types'
import { Icons } from './icons'

const KEY = 'ui-language'

const NATIVE_NAME: Record<string, string> = {
  en: 'English (EN)',
  id: 'Indonesia (ID)',
  'zh-CN': '简体中文 (ZH)',
  zh: '简体中文 (ZH)',
  fa: 'فارسی (FA)',
  pa: 'پښتو (PA)'
}

const SETTING_KEYS: Array<[string, string]> = [
  ['loop', 'Loop'],
  ['speed', 'Speed'],
  ['danmaku', 'Danmaku'],
  [KEY, 'Language'],
  ['danmaku-switcher', 'Display'],
  ['heatmap', 'Heatmap'],
  ['danmaku-font', 'FontSize'],
  ['danmaku-opacity', 'Opacity'],
  ['danmaku-area', 'Display Area']
]

export default function registerLanguageSetting(it: UIInterface) {
  const { player, setting, $root } = it
  if (!setting) return

  const current = player.locales.lang === 'zh' ? 'zh-CN' : player.locales.lang

  setting.register(<Setting>{
    key: KEY,
    type: 'selector',
    name: player.locales.get('Language'),
    icon: Icons.get('lang'),
    children: player.locales.available().map((code) => ({
      name: NATIVE_NAME[code] || code.toUpperCase(),
      value: code,
      default: current === code || current === code.split('-')[0]
    })),
    onChange: ({ value }: { value: Lang }) => {
      player.locales.setLang(value)
      player.options.lang = value
      patchSettingLabels(player, $root)
      player.emit('notice', { text: NATIVE_NAME[value] || value })
    }
  })
}

function patchSettingLabels(player: UIInterface['player'], $root: HTMLElement) {
  SETTING_KEYS.forEach(([key, i18nKey]) => {
    const $row = $root.querySelector(`[data-key="${key}"]`)
    const $name = $row?.querySelector('span:not([role="label"])')
    if ($name) $name.textContent = player.locales.get(i18nKey)
  })

  const settingsLabel = player.locales.get('Settings')
  $root.querySelectorAll('button[aria-label]').forEach((btn) => {
    const label = btn.getAttribute('aria-label')
    if (label && /setting|pengaturan|设置|تنظیمات|ترتیبات/i.test(label)) {
      btn.setAttribute('aria-label', settingsLabel)
    }
  })
}
