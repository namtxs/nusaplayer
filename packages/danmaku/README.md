# @nusaplayer/danmaku

[![npm](https://img.shields.io/npm/v/@nusaplayer/danmaku?style=flat-square&color=ffa500&label=@nusaplayer/danmaku)](https://www.npmjs.com/package/@nusaplayer/danmaku)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@nusaplayer/ui?style=flat-square&label=danmaku)
[![npm dm](https://img.shields.io/npm/dm/@nusaplayer/danmaku?style=flat-square)](https://www.npmjs.com/package/@nusaplayer/danmaku)
[![jsdelivr](https://data.jsdelivr.com/v1/package/npm/@nusaplayer/danmaku/badge)](https://www.jsdelivr.com/package/npm/@nusaplayer/danmaku)

Danmaku plugin for NusaPlayer.

## Install

```bash
npm i @nusaplayer/core @nusaplayer/danmaku
```

```html
<script src="https://cdn.jsdelivr.net/npm/@nusaplayer/core@latest/dist/index.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@nusaplayer/danmaku@latest/dist/index.min.js"></script>

<div id="player"></div>

<script>
  NusaPlayer.make('#player', {
    source: {
      src: 'https://vjs.zencdn.net/v/oceans.mp4'
    }
  })
    .use([new NusaDanmaku({ source: [] })])
    .create()
</script>
```

## Usage

```ts
export type Options = {
  source: string | Function | Comment[]
  /**
   * @default: 144
   * */
  speed?: number
  opacity?: number
  fontSize?: number
  /**
   * @default: 'dom'
   */
  engine: 'canvas' | 'dom'
  /**
   * @default true
   */
  enable?: boolean
  /**
   * Show the send input. Desktop only.
   * @default false
   */
  displaySender?: boolean
  /**
   * Called when sending from the input. Return false to block.
   */
  onEmit?: (comment: Comment) => boolean | void
}

export interface Comment {
  text?: string
  /**
   * @default rtl
   */
  mode?: 'ltr' | 'rtl' | 'top' | 'bottom'
  /**
   * Specified in seconds. Not required in live mode.
   * @default media?.currentTime
   */
  time?: number
  style?: Partial<CSSStyleDeclaration> | CanvasRenderingContext2D
  /**
   * A custom render to draw comment.
   * When it exist, `text` and `style` will be ignored.
   */
  render?(): HTMLElement | HTMLCanvasElement
}
```

### Load comments

```ts
const danmaku = new NusaDanmaku({
  source: [
    { text: 'hello', mode: 'rtl', time: 1 },
    { text: 'world', mode: 'rtl', time: 2 }
  ]
  // or: source: () => fetch('xxxxx')
})
```

### Live comments

```ts
const ws = new WebSocket('wss://xxxxxx')

ws.onmessage = async function (msg) {
  danmaku.emit(msg)
}

ws.send({ text: 'hello' })
```
