# @nusaplayer/torrent

[![npm](https://img.shields.io/npm/v/@nusaplayer/torrent?style=flat-square&label=@nusaplayer/torrent)](https://www.npmjs.com/package/@nusaplayer/torrent)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@nusaplayer/torrent?style=flat-square)
[![npm dm](https://img.shields.io/npm/dm/@nusaplayer/torrent?style=flat-square)](https://www.npmjs.com/package/@nusaplayer/torrent)
[![jsdelivr](https://data.jsdelivr.com/v1/package/npm/@nusaplayer/torrent/badge)](https://www.jsdelivr.com/package/npm/@nusaplayer/torrent)

[WebTorrent](https://github.com/webtorrent/webtorrent) plugin for NusaPlayer.

## Install

**Requires webtorrent@0.98.18**

```bash
npm i @nusaplayer/core @nusaplayer/torrent webtorrent@0.98.18
```

```html
<script src="https://cdn.jsdelivr.net/npm/@nusaplayer/core@latest/dist/index.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@nusaplayer/torrent@latest/dist/index.min.js"></script>

<div id="player"></div>

<script>
  NusaPlayer.make('#player', {
    source: {
      title: 'sintel',
      src: 'https://webtorrent.io/torrents/sintel.torrent'
    }
  })
    .use([NusaTorrent({ library: 'https://cdn.jsdelivr.net/npm/webtorrent@0.98.18/webtorrent.min.js' })])
    .create()
</script>
```
