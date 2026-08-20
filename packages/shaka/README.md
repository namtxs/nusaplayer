# @nusaplayer/shaka

[![npm](https://img.shields.io/npm/v/@nusaplayer/shaka?style=flat-square&label=@nusaplayer/shaka)](https://www.npmjs.com/package/@nusaplayer/shaka)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@nusaplayer/shaka?style=flat-square)
[![npm dm](https://img.shields.io/npm/dm/@nusaplayer/shaka?style=flat-square)](https://www.npmjs.com/package/@nusaplayer/shaka)
[![jsdelivr](https://data.jsdelivr.com/v1/package/npm/@nusaplayer/shaka/badge)](https://www.jsdelivr.com/package/npm/@nusaplayer/shaka)

[shaka-player](https://github.com/shaka-project/shaka-player) plugin for NusaPlayer.

## Install

```bash
npm i @nusaplayer/shaka shaka-player
```

```html
<script src="https://cdn.jsdelivr.net/npm/@nusaplayer/core@latest/dist/index.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@nusaplayer/shaka@latest/dist/index.min.js"></script>

<div id="player"></div>

<script>
  NusaPlayer.make('#player', {
    source: {
      src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
    }
  })
    .use([
      NusaShaka({
        library: 'https://cdn.jsdelivr.net/npm/shaka-player@4.14.1/dist/shaka-player.compiled.min.js'
      })
    ])
    .create()
</script>
```
