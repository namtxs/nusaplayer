import { $, isMobile } from '@nusaplayer/core'
import { controllerHidden } from '../style'
import { thumbnailCls, vttThumbnailsCls } from './Thumbnail'

export const buffered = $.css({
  'background-color': 'hsla(0, 0%, 100%, 0.4)'
})

export const played = $.css({
  'background-color': 'var(--primary-color)'
})

export const dot = $.css({
  'pointer-events': 'none',
  position: 'absolute',
  left: '0',
  top: '0',
  bottom: '0',
  width: '100%',

  '& > *': {
    display: 'block',
    position: 'absolute',
    width: '22px',
    height: '22px',
    top: '50%',
    left: '0',
    margin: '0',
    transform: isMobile ? 'translate(-50%, -50%)' : 'translate(-50%, -50%) scale(0)',
    'transform-origin': 'center',
    transition: 'transform 0.2s ease',
    'z-index': '1'
  },

  '& > svg': {
    fill: 'unset',
    stroke: 'none',
    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.35))'
  },

  '& > *:not(svg)': {
    width: '0.85em',
    height: '0.85em',
    'border-radius': '50%',
    'background-color': 'var(--primary-color)',
    'box-shadow': '0 0 0 3px rgba(255, 255, 255, 0.35), 0 1px 4px rgba(0, 0, 0, 0.4)'
  }
})

export const hit = $.css({
  position: 'absolute',
  left: '0',
  'border-radius': '2px',
  padding: '6px 8px',
  'background-color': 'var(--shadow-background-color)',
  color: '#fff',
  'z-index': '2',
  'pointer-events': 'none',
  transform: 'translateX(-50%)',
  display: 'none',
  bottom: '15px'
})

export const progressDragging = $.css('/* progressDragging */')

export const progressInner = $.css({
  position: 'relative',
  overflow: 'visible',
  height: '0.28em',
  width: '100%',
  'border-radius': '0.2em',
  'background-color': 'hsla(0, 0%, 100%, 0.22)',
  transition: 'height 0.2s ease',

  [`& .${buffered}, & .${played}`]: {
    position: 'absolute',
    left: '0',
    top: '0',
    bottom: '0',
    'border-radius': '0.2em',
    'pointer-events': 'none'
  }
})

export const progress = $.css(
  Object.assign(
    {
      position: 'relative',
      'box-sizing': 'border-box',
      padding: '0.5em',
      cursor: 'pointer',
      width: '100%',
      'font-size': '0.75em',
      transition: 'padding 0.2s ease',

      [`&:hover .${progressInner}, &.${progressDragging} .${progressInner}`]: {
        height: '0.5em'
      },

      [`&.${progressDragging} .${hit}, &.${progressDragging} .${thumbnailCls}, &.${progressDragging} .${vttThumbnailsCls}`]:
        {
          display: 'block'
        }
    },
    isMobile
      ? {
          [`@global .${controllerHidden} .${dot} > *`]: {
            transform: 'translate(-50%, -50%) scale(0)'
          }
        }
      : {
          [`&.${progressDragging} .${dot} > *, &:hover .${dot} > *`]: {
            transform: 'translate(-50%, -50%) scale(1)'
          }
        }
  )
)
