import { $, isMobile } from '@nusaplayer/core'
import { icon } from '../style'

export const time = $.css(
  Object.assign(
    {
      'font-variant-numeric': 'tabular-nums',
      'font-size': '0.875em',
      'font-weight': 600,
      'white-space': 'nowrap'
    },
    isMobile && {
      'font-size': '0.75em',
      'max-width': '7em',
      overflow: 'hidden',
      'text-overflow': 'ellipsis'
    }
  )
)

export const live = $.css(
  `width:0.5em!important;height:0.5em!important;;background-color:var(--primary-color);border-radius:50%;margin-right:0.5em`
)

export const expand = $.css(`
    position: absolute;
    top: 10px;
    right: 50%;
    border-radius: 2px;
    box-sizing: border-box;
    transform: translate(50%, -100%);
    transition: opacity 0.2s ease, top 0.2s ease;
    font-size: 0.875em;
    font-weight: 600;
`)

export const expandBottom = $.css(`
    top: calc(100% - 10px);
    right: 50%;
    transform: translateX(50%);
`)

export const dropdown = $.css({
  position: 'relative',
  display: 'flex',
  'z-index': 1,

  [`& .${expand}`]: {
    visibility: 'hidden',
    opacity: 0,
    'pointer-events': 'none',
    'z-index': 10,
    'background-color': 'var(--shadow-background-color)'
  }
})

const dropdownShown = {
  'padding-top': '0.5em',
  'margin-top': '-0.5em',

  [`& .${expand}`]: {
    visibility: 'visible',
    opacity: 1,
    'pointer-events': 'auto',
    top: 0
  }
}

const dropdownShownTop = {
  'padding-bottom': '0.5em',
  'margin-bottom': '-0.5em',
  'padding-top': '0',
  'margin-top': '0',

  [`& .${expand}`]: {
    visibility: 'visible',
    opacity: 1,
    'pointer-events': 'auto',
    top: '100%'
  }
}

export const dropdownHoverable = $.css(
  isMobile
    ? {
        ['&[data-open="true"]']: dropdownShown,
        ['&[data-dropdown-pos=top][data-open="true"]']: dropdownShownTop
      }
    : {
        ['&:hover']: dropdownShown,
        ['&[data-dropdown-pos=top]:hover']: dropdownShownTop
      }
)

export const dropItem = $.css({
  padding: '0.45em 0.75em',
  'min-width': '8em',
  'max-width': '14em',
  display: 'flex',
  'align-items': 'center',
  'justify-content': 'center',
  'min-height': '2.4em',
  'line-height': '1.3',
  'box-sizing': 'border-box',
  cursor: 'pointer',
  'text-align': 'center',
  'overflow-wrap': 'anywhere',
  'word-break': 'break-word',

  '&:nth-last-child(1)': {
    'margin-bottom': '0px'
  },

  '& *': {
    'pointer-events': 'none'
  },

  '&[aria-checked=true]': {
    color: 'var(--primary-color)'
  },

  '&:hover': {
    'background-color': 'rgba(255, 255, 255, 0.1)'
  }
})

export const textIcon = $.cls('textIcon')

export const withIcon = $.css({
  display: 'flex',
  'align-items': 'center',
  'flex-shrink': 0,
  'min-width': 0,

  [`& > .${icon}:last-child${
    isMobile ? `, & >  .${icon}[aria-label="Play"], & >  .${icon}[aria-label="Pause"]` : ''
  }`]: {
    'margin-right': 0
  }
})

export const controllers = $.css({
  color: '#fff',
  height: '2.5em',
  display: 'flex',
  'box-sizing': 'border-box',
  'justify-content': 'space-between',
  'align-items': 'center',
  'min-width': 0,
  'padding-bottom': isMobile ? 0 : '0.25em',
  overflow: 'visible',

  [`& .${icon}.${textIcon}`]: {
    width: 'auto',
    'min-width': isMobile ? 'auto' : '2.6em',
    'font-size': isMobile ? '0.75em' : '0.8125em',
    'font-weight': 600,
    padding: isMobile ? '0 4px' : '0 6px',
    'font-variant-numeric': 'tabular-nums',
    'border-radius': '8px',
    'flex-shrink': 0,

    '& > *': {
      height: 'auto',
      width: 'auto'
    }
  },

  [`& .${icon}`]: Object.assign(
    {
      width: isMobile ? '1.85em' : '2em',
      height: isMobile ? '1.85em' : '2em',
      'margin-right': isMobile ? '0.2em' : '0.5em',
      'justify-content': 'center',
      'align-items': 'center',
      display: 'inline-flex',
      'flex-shrink': 0,

      '& > *': {
        height: '1.5em',
        width: '1.5em',
        'pointer-events': 'none'
      }
    },

    isMobile
      ? { '&:active > *': { transform: 'scale(.9)' } }
      : {
          'border-radius': '8px',
          '&:hover': { 'background-color': 'rgb(255 255 255 / .18)' }
        }
  ),

  '@media (max-width: 480px)': {
    [`& .${icon}`]: {
      width: '1.7em',
      height: '1.7em',
      'margin-right': '0.12em'
    },
    [`& .${icon}.${textIcon}`]: {
      padding: '0 3px',
      'font-size': '0.7em'
    }
  }
})

export const centerProgressWrap = $.css({
  flex: 1,
  'min-width': 0,
  height: '100%',
  display: 'flex',
  'align-items': 'center',
  'justify-content': 'center',
  overflow: 'visible',
  'padding-left': isMobile ? '0.3em' : '1em',
  'padding-right': isMobile ? '0.3em' : '1em',
  '> div': {
    'min-width': 0,
    display: 'flex',
    'align-items': 'center',
    overflow: 'visible'
  },
  '@media (max-width: 480px)': {
    'padding-left': '0.15em',
    'padding-right': '0.15em'
  }
})
