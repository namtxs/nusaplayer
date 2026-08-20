import { Player, $, isMobile } from '@nusaplayer/core'
import Danmaku from 'danmaku'
import { getMode } from './danmaku-parse'
import { Options, Comment } from './types'

function registerInputStyle() {
  const modeSelectionWrap = $.css({
    display: 'none',
    'box-sizing': 'border-box',
    width: '216px',
    height: 'auto',
    padding: '8px 0 10px',
    position: 'absolute',
    bottom: 'calc(100% + 6px)',
    left: '50%',
    'margin-left': '-108px',
    background: 'rgba(21,21,21,.9)',
    'border-radius': '2px',
    'user-select': 'none',
    'z-index': 20,
    'pointer-events': 'auto',
    '&::before': {
      content: "''",
      position: 'absolute',
      left: 0,
      right: 0,
      top: '100%',
      height: '10px'
    }
  })

  const modeSelectionRowSelection = $.css(`
  display: flex;
  flex-wrap: wrap;
  margin: 8px -8px 0 0;`)

  const danmakuTypeWrap = $.css({
    width: '24px',
    height: '32px',
    padding: '0',
    'line-height': '32px',
    'text-align': 'center',
    color: '#757575',
    fill: 'currentColor',
    stroke: 'none',
    'flex-shrink': 0,
    'margin-left': '6px',
    position: 'relative',
    'z-index': 12,
    'box-sizing': 'border-box',
    overflow: 'visible',
    cursor: 'pointer',

    '&:hover': {
      color: 'var(--primary-color)'
    },

    [`&:hover .${modeSelectionWrap}`]: { display: 'block' },
    [`&[data-open="true"] .${modeSelectionWrap}`]: { display: 'block' },

    [`& .${modeSelectionRowSelection} label`]: {
      flex: 1,
      'margin-bottom': '8px'
    },

    '& input[type="radio"]': { display: 'none' },

    '& input[type="radio"]:checked + label > div': {
      background: 'var(--primary-color)'
    }
  })

  const danmakuType = $.css(`
    display: inline-flex;
    height: 100%;
    align-items: center;
  `)

  const danmakuTypeIcon = $.css(`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
  `)

  const danmakuTypeSvg = $.css(`width: 100%;height: 100%;fill:currentColor;stroke:none;transition: fill .15s ease-in-out;`)

  const modeSelectionRow = $.css(`
  min-height: 22px;
  margin: 10px 20px;
  width: 176px;
  line-height: 22px;
  font-size: 12px;`)

  const modeSelectionRowTitle = $.css(`text-align: left;color: #fff; line-height: 16px;`)

  const modeSelectionSpan = $.css(`
    position: relative;
    cursor: pointer;
    border-radius: 2px;
    color: #fff;
    text-align: center;
    margin-right: 8px;
    background: hsla(0,0%,100%,.2);
    font-size: 12px;
  `)

  const colorPickerInput = $.css({
    outline: 'none',
    'box-shadow': 'none',
    'background-color': '#fff',
    color: '#000',
    border: '1px solid hsla(0,0%,100%,.2)',
    'border-radius': '2px',
    padding: '4px 7px',
    margin: '0 auto 8px auto',
    'text-shadow': '0px 0px 6px #FFF',
    'text-align': 'center',
    '&:focus, &:focus-visible': {
      outline: 'none',
      'box-shadow': 'none'
    }
  })

  const colorPickerWrap = $.css(
    `display: grid;grid-template-columns: repeat(7,auto);width: 100%;justify-items: center;`
  )

  const activeColor = $.css('box-shadow: 0 0 1px 1px #fff;border-color: #000;')

  const colorPicker = $.css(`
  width: 16px;
  height: 16px;
  border: 1px solid rgba(0,0,0,.3);
  box-sizing: border-box;
  border-radius: 2px;
  margin-bottom: 4px;
  cursor: pointer;
  display: inline-block;
  `)

  const inputBar = $.css({
    display: 'flex',
    'align-items': 'center',
    flex: isMobile ? '1 1 auto' : '0 1 22em',
    width: isMobile ? '100%' : '22em',
    'max-width': '100%',
    'min-width': 0,
    'box-sizing': 'border-box',
    'border-radius': '4px',
    background: '#f4f4f4',
    color: '#999',
    height: '32px',
    'max-height': '32px',
    'min-height': '32px',
    'align-self': 'center',
    margin: isMobile ? '0' : '1px 0 0',
    overflow: 'visible',
    position: 'relative',
    outline: 'none',
    'box-shadow': 'none',
    '&:focus, &:focus-within, &:focus-visible': {
      outline: 'none',
      'box-shadow': 'none'
    }
  })

  const inputBarWrap = $.css(`
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  align-items: center;
  overflow: visible;
`)

  const input = $.css({
    flex: '1 1 auto',
    'min-width': 0,
    padding: '0 8px',
    height: '32px',
    border: 0,
    'box-sizing': 'border-box',
    background: 'none',
    'line-height': '32px',
    color: '#212121',
    'font-size': '12px',
    'text-decoration': 'none',
    outline: 'none',
    'box-shadow': 'none',
    'touch-action': 'manipulation',
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
    '-webkit-tap-highlight-color': 'transparent',
    '-webkit-appearance': 'none',
    appearance: 'none',
    '&:focus, &:focus-visible, &:active': {
      outline: 'none',
      'box-shadow': 'none',
      border: 0
    }
  })

  const send = $.css(`
  height: 100%;
  width: ${isMobile ? '3.2em' : '60px'};
  min-width: ${isMobile ? '3.2em' : '60px'};
  flex: 0 0 auto;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  box-sizing: border-box;
  overflow: hidden;
`)

  const sendBottom = $.css(`
  height: 100%;
  background-color: var(--primary-color,#fb7299);
  color: #fff;
  width: 100%;
  min-width: 0;
  outline: none;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`)

  return {
    inputBar,
    inputBarWrap,
    input,
    send,
    sendBottom,
    danmakuTypeWrap,
    danmakuType,
    danmakuTypeIcon,
    danmakuTypeSvg,
    modeSelectionWrap,
    modeSelectionRow,
    modeSelectionRowTitle,
    modeSelectionRowSelection,
    modeSelectionSpan,
    colorPicker,
    colorPickerInput,
    colorPickerWrap,
    activeColor
  }
}

export function registerInput(player: Player, danmaku: Danmaku, options: Options) {
  if (!player.context.ui) return
  const {
    inputBar,
    inputBarWrap,
    input,
    send,
    sendBottom,
    danmakuTypeWrap,
    danmakuType,
    danmakuTypeIcon,
    danmakuTypeSvg,
    modeSelectionWrap,
    modeSelectionRow,
    modeSelectionRowTitle,
    modeSelectionRowSelection,
    modeSelectionSpan,
    colorPickerWrap,
    colorPicker,
    colorPickerInput,
    activeColor
  } = registerInputStyle()

  const t = (key: string) => player.locales.get(key)

  const $tpl = $.create(
    `div.${inputBar}`,
    {},
    `<div class="${inputBarWrap}">
      <div class="${danmakuTypeWrap}">
        <span class="${danmakuType}">
          <span class="${danmakuTypeIcon}">
            <svg viewBox="0 0 22 22" class="${danmakuTypeSvg}">
              <path d="M6.2 16.6L10.6 5.4h.8L15.8 16.6h-1.7l-1-2.7H9l-1.05 2.7H6.2zm3.2-4h3.2L11 8.15h-.05L9.4 12.6z"/>
              <path d="M13.35 12.85l4.55 7.85h-2.35l-1.15-2.1-1.15 2.1H10.9l3.55-6.15.45-.3z"/>
            </svg>
          </span>
        </span>
        <div class="${modeSelectionWrap}">
          <div class="${modeSelectionRow}">
            <div class="${modeSelectionRowTitle}">${t('FontSize')}</div>
            <div class="${modeSelectionRowSelection}">
              <input type="radio" id="font-size-s" name="font-size" value="18">
              <label for=font-size-s>
                <div class="${modeSelectionSpan}" data-type="fontsize">
                  <span>${t('Small')}</span>
                </div>
              </label>
              <input type="radio" id="font-size-m" name="font-size" value="25" checked>
              <label for=font-size-m>
                <div class="${modeSelectionSpan}" data-type="fontsize">
                  <span>${t('Standard')}</span>
                </div>
              </label>
            </div>
          </div>
          <div class="${modeSelectionRow}">
            <div class="${modeSelectionRowTitle}">${t('Mode')}</div>
            <div class="${modeSelectionRowSelection}">
              <input type="radio" id="mode-s" name="mode" value="1" checked>
              <label for="mode-s">
                <div class="${modeSelectionSpan}" data-type="mode">
                  <span>${t('Scroll')}</span>
                </div>
              </label>
              <input type="radio" id="mode-t" name="mode" value="5">
              <label for="mode-t">
                <div class="${modeSelectionSpan}" data-type="mode">
                  <span>${t('Top')}</span>
                </div>
              </label>
              <input type="radio" id="mode-b" name="mode" value="4">
              <label for="mode-b">
                <div class="${modeSelectionSpan}" data-type="mode">
                  <span>${t('Bottom')}</span>
                </div>
              </label>
            </div>
          </div>
          <div class="${modeSelectionRow}">
            <div class="${modeSelectionRowTitle}">${t('Color')}</div>
            <div class="${modeSelectionRowSelection}">
              <input class="${colorPickerInput}" value="#FFFFFF" >
                <div class="${colorPickerWrap}">
              ${[
                '#FE0302',
                '#FF7204',
                '#FFAA02',
                '#FFD302',
                '#FFFF00',
                '#A0EE00',
                '#00CD00',
                '#019899',
                '#4266BE',
                '#89D5FF',
                '#CC0273',
                '#222222',
                '#9B9B9B',
                '#FFFFFF'
              ]
                .map((color, i) => {
                  return `<span class="${colorPicker} ${
                    i == 13 ? activeColor : ''
                  }" style="background-color: ${color};" data-value="${color}"></span>`
                })
                .join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
      <input class="${input}" placeholder="${t('Send a friendly danmaku')}"/>
    </div>
    <div class="${send}">
      <div class="${sendBottom}">${t('Send')}</div>
    </div>`
  )
  const $colorPickerInput = $tpl.querySelector<HTMLInputElement>(`.${colorPickerInput}`)!
  const $colorPickerWrap = $tpl.querySelector<HTMLInputElement>(`.${colorPickerWrap}`)!

  $colorPickerInput.oninput = function (e: Event) {
    ;(<HTMLInputElement>e.target).style.backgroundColor = (<HTMLInputElement>e.target).value
  }
  $colorPickerWrap.onclick = function (e: Event) {
    const target = e.target as HTMLSpanElement
    if (target.tagName == 'SPAN') {
      $colorPickerInput.style.backgroundColor = $colorPickerInput.value =
        target.getAttribute('data-value')!

      Array.from(target.parentElement!.children).forEach((it) => it.classList.remove(activeColor))
      target.classList.add(activeColor)
    }
  }

  const parent = player.context.ui.$controllerBottom
  const $input = $tpl.querySelector<HTMLInputElement>(`.${input}`)!
  const $typeWrap = $tpl.querySelector<HTMLElement>(`.${danmakuTypeWrap}`)!
  const slot = parent.children[1] as HTMLElement | undefined
  if (slot) {
    slot.appendChild($tpl)
  } else {
    parent.insertBefore($tpl, parent.lastElementChild)
  }

  $typeWrap.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest(`.${modeSelectionWrap}`)) return
    e.stopPropagation()
    const open = $typeWrap.getAttribute('data-open') == 'true'
    $typeWrap.setAttribute('data-open', open ? 'false' : 'true')
  })

  const closeTypePanel = (e: Event) => {
    const node = e.target as HTMLElement
    if (node.closest?.(`.${danmakuTypeWrap}`)) return
    $typeWrap.removeAttribute('data-open')
  }
  player.$root.addEventListener('click', closeTypePanel)
  player.on('controlshidden', () => $typeWrap.removeAttribute('data-open'))
  const $playerRoot = player.$root
  player.on('destroy', () => $playerRoot.removeEventListener('click', closeTypePanel))

  function submit() {
    const fontSize = $tpl.querySelector<HTMLInputElement>('input[name="font-size"]:checked')?.value ?? '25'
    const mode = $tpl.querySelector<HTMLInputElement>('input[name="mode"]:checked')?.value ?? '1'
    const color = $tpl.querySelector<HTMLInputElement>(`.${colorPickerInput}`)?.value || '#FFFFFF'

    if ($input.value) {
      const comment: Comment = {
        mode: getMode(+mode),
        text: $input.value,
        time: player.currentTime,
        style: { color: color, fontSize: `${fontSize}px` }
      }
      if (options.onEmit && options.onEmit(comment) === false) return
      const uiRoot = player.context.ui?.$root
      if (!uiRoot) return
      const primaryColor = window.getComputedStyle(uiRoot).getPropertyValue('--primary-color')

      //@ts-ignore
      comment.style!.border = `2px solid ${primaryColor}`
      //@ts-ignore
      comment.style!.marginTop = '4px'
      danmaku.emit(comment)
      $input.value = ''
      $input.blur()
    }
  }

  $tpl.querySelector(`.${sendBottom}`)!.addEventListener('click', submit)
  $input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') submit()
  })
}
