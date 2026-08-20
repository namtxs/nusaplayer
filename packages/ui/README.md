# NusaPlayer UI

[![npm](https://img.shields.io/npm/v/@nusaplayer/ui?style=flat-square&label=@nusaplayer/ui)](https://www.npmjs.com/package/@nusaplayer/ui)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@nusaplayer/ui?style=flat-square)
[![npm dm](https://img.shields.io/npm/dm/@nusaplayer/ui?style=flat-square)](https://www.npmjs.com/package/@nusaplayer/ui)
[![jsdelivr](https://data.jsdelivr.com/v1/package/npm/@nusaplayer/ui/badge)](https://www.jsdelivr.com/package/npm/@nusaplayer/ui)

Controls and theme for NusaPlayer.

## Install

```bash
npm i @nusaplayer/core @nusaplayer/ui
```

```html
<script src="https://cdn.jsdelivr.net/npm/@nusaplayer/core@latest/dist/index.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@nusaplayer/ui@latest/dist/index.min.js"></script>
```

## Basic

```js
const player = Player.make('#player', {
  source: {
    title: 'Demo',
    src: 'https://vjs.zencdn.net/v/oceans.mp4'
  }
})
  .use([NusaUI()])
  .create()
```
