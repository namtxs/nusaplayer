# @nusaplayer/mpegts

[![npm](https://img.shields.io/npm/v/@nusaplayer/mpegts?style=flat-square&label=@nusaplayer/mpegts)](https://www.npmjs.com/package/@nusaplayer/mpegts)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@nusaplayer/mpegts?style=flat-square)
[![npm dm](https://img.shields.io/npm/dm/@nusaplayer/mpegts?style=flat-square)](https://www.npmjs.com/package/@nusaplayer/mpegts)
[![jsdelivr](https://data.jsdelivr.com/v1/package/npm/@nusaplayer/mpegts/badge)](https://www.jsdelivr.com/package/npm/@nusaplayer/mpegts)

[FLV / MPEG-TS](https://github.com/xqq/mpegts.js) plugin for NusaPlayer.

## Install

```bash
npm i @nusaplayer/core @nusaplayer/mpegts mpegts.js
```

```html
<script src="https://cdn.jsdelivr.net/npm/@nusaplayer/core@latest/dist/index.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/mpegts.js@latest/dist/mpegts.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@nusaplayer/mpegts@latest/dist/index.min.js"></script>

<div id="player"></div>

<script>
  NusaPlayer.make('#player', {
    source: {
      src: 'https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-360p.flv',
      format: 'flv'
    }
  })
    .use([NusaMpegts()])
    .create()
</script>
```

## Usage

```ts
export type Matcher = (video: HTMLVideoElement, source: Source) => boolean

export type Active = (
  instance: Mpegts.Player,
  library: typeof Mpegts
) => void | ((instance: Mpegts.Player, library: typeof Mpegts) => void)

export type MpegtsPluginOptions = {
  config?: Partial<Mpegts.Config>
  matcher?: Matcher
  active?: Active
}
```
