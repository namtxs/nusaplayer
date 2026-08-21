import { $, isMobile } from '@nusaplayer/core'
import { fullscreen, webFullScreen } from '../style'

export const activeCls = $.css('display: block;')

export const settingCls = (position: 'top' | 'bottom') =>
  $.css(
    Object.assign(
      {
        'z-index': '8',
        'max-height': '75%',
        'border-radius': '2px',
        display: 'block',
        position: 'absolute',
        right: isMobile ? '0.35em' : '1em',
        [position]: position == 'top' ? 'var(--control-bar-height)' : '2.5em',
        overflow: 'auto',
        'background-color': 'var(--shadow-background-color)',
        fill: 'currentColor',
        color: '#fff',
        'font-weight': 600,

        '& svg': {
          fill: 'currentColor',
          stroke: 'none'
        },

        '&::-webkit-scrollbar': { width: '2px' },

        '&::-webkit-scrollbar-thumb': {
          background: 'var(--primary-color)'
        },

        '& > div': { display: 'none', 'font-size': '0.875em' },

        [`& > div.${activeCls}`]: { display: 'block' },

        [`@global .${fullscreen} &, @global .${webFullScreen} &`]: {
          right: `calc(${isMobile ? '0.35em' : '1em'} + env(safe-area-inset-right, 0px))`,
          [position]:
            position == 'top'
              ? 'calc(var(--control-bar-height) + env(safe-area-inset-top, 0px))'
              : 'calc(2.5em + env(safe-area-inset-bottom, 0px))'
        }
      },
      isMobile && {
        'max-width': 'calc(100% - 0.7em)'
      }
    )
  )

export const panelCls = $.css(isMobile ? 'min-width: 12em; max-width: 100%;' : 'min-width: 15.5em;')

export const subPanelCls = $.css('min-width: 10.5em;')

// √
export const yesIcon = $.css(`
  display: none;
  width: 1.4em;
  height: 1.4em;
`)

// >
export const nextIcon = $.css(`
  width: 2em;
  height: 2em;
  margin: 0 -10px 0 -5px;
`)

// <
export const backIcon = $.css(`
  width: 2em;
  height: 2em;
  transform: rotate(180deg);
  margin-left: -10px;
`)

export const switcherCls = $.css({
  position: 'absolute',
  cursor: 'pointer',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  'background-color': '#ccc',
  transition: '.3s',
  'border-radius': '34px',

  '&:before': {
    position: 'absolute',
    content: '""',
    height: '1em',
    width: '1em',
    left: '0.25em',
    bottom: '0.1875em',
    'background-color': 'white',
    transition: '.3s',
    'border-radius': '50%'
  }
})

export const switcherContainer = $.css(`
  position: relative;
  width: 2.5em;
  height: 1.375em;
`)

// `selectedText` >
export const nextLabelText = $.css(`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 8em;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8em;
`)

export const settingItemCls = $.css({
  height: '2.4em',
  cursor: 'pointer',
  color: '#fff',
  'justify-content': 'space-between',
  'align-items': 'center',
  padding: '0 0.75em',
  'line-height': '1',
  display: 'flex',
  overflow: 'hidden',

  '&:not([aria-label=slider]) > *': { 'pointer-events': 'none' },

  '&:hover': {
    'background-color': 'rgba(255, 255, 255, 0.1)'
  },

  [`&[aria-checked='true']`]: {
    [`& .${yesIcon}`]: { display: 'block' },
    [`&[data-index]`]: {
      'background-color': 'rgba(255, 255, 255, 0.1)'
    },

    [`& .${switcherCls}`]: {
      'background-color': 'var(--primary-color)',

      '&:before': { transform: 'translateX(1em)' }
    }
  }
})

export const settingItemLeft = $.css({
  display: 'flex',
  'align-items': 'center',
  'margin-right': '10px',
  'min-width': 0,
  flex: 1,

  '& > span': {
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
    'white-space': 'nowrap'
  },

  '& > svg': {
    width: '1.5em',
    height: '1.5em',
    'margin-right': '0.55em',
    'flex-shrink': 0,
    display: 'block',
    fill: 'currentColor',
    stroke: 'none'
  }
})

export const settingItemRight = $.css(`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`)

export const backRow = $.css({
  width: '100%',
  display: 'flex',
  'align-items': 'center',
  'border-bottom': '1px solid rgb(255 255 255 / 10%)'
})

export const sliderCls = $.css({
  '-webkit-appearance': 'none',
  width: '90%',
  height: '0.4em',
  outline: 'none',
  'border-radius': '34px',
  background: 'rgb(204, 204, 204)',
  margin: '0',
  cursor: 'pointer',
  position: 'relative',

  '&::-webkit-slider-thumb': {
    '-webkit-appearance': 'none',
    appearance: 'none',
    background: '#fff',
    height: '1em',
    width: '1em',
    'border-radius': '50%',
    border: 'none'
  },

  '&:hover::before': {
    visibility: 'visible'
  },

  '::before': {
    position: 'absolute',
    left: '-0.3em',
    top: '50%',
    transform: 'translate(-100%, -50%)',
    content: 'attr(value)',
    color: 'rgba(255, 255, 255, 0.7)',
    visibility: 'hidden',
    'font-size': '0.8em'
  }
})
