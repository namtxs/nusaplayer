# @nusaplayer/hls

[![npm](https://img.shields.io/npm/v/@nusaplayer/hls?style=flat-square&label=@nusaplayer/hls)](https://www.npmjs.com/package/@nusaplayer/hls)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@nusaplayer/hls?style=flat-square)
[![npm dm](https://img.shields.io/npm/dm/@nusaplayer/hls?style=flat-square)](https://www.npmjs.com/package/@nusaplayer/hls)
[![jsdelivr](https://data.jsdelivr.com/v1/package/npm/@nusaplayer/hls/badge)](https://www.jsdelivr.com/package/npm/@nusaplayer/hls)

[HLS](https://github.com/video-dev/hls.js) plugin for NusaPlayer.

## Install

```bash
npm i @nusaplayer/hls hls.js
```

```html
<script src="https://cdn.jsdelivr.net/npm/@nusaplayer/core@latest/dist/index.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@nusaplayer/hls@latest/dist/index.min.js"></script>

<div id="player"></div>

<script>
  NusaPlayer.make('#player', {
    source: {
      src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
    }
  })
    .use([NusaHls({ library: 'https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js' })])
    .create()
</script>
```

## Quality / Audio / Subtitle defaults

```js
NusaHls({
  forceHLS: true,
  defaultQuality(levels) {
    let id = -1
    for (let i = 0; i < levels.length; i++) {
      if (levels[i].height <= 1080) id = i
    }
    return id
  },
  defaultAudio(tracks) {
    for (const { lang, id } of tracks) {
      if (lang == 'en' || lang.startsWith('en')) return id
    }
    return -1
  },
  defaultSubtitle(tracks) {
    for (const { lang, id } of tracks) {
      if (lang == 'en' || lang.startsWith('en')) return id
    }
    return -1
  }
})
```

## Handle hls.js errors

```ts
NusaHls({
  errorHandler(player, data) {
    if (data.details == 'bufferAppendError') return

    player.emit('error', {
      ...data,
      message: data.type + ': ' + data.details
    })
  }
})
```

## DRM

```ts
NusaHls({
  forceHLS: true,
  config: {
    emeEnabled: true,
    drmSystems: {
      'com.widevine.alpha': {
        licenseUrl: 'https://widevine-proxy.appspot.com/proxy'
      }
    },
    licenseXhrSetup(xhr) {
      xhr.setRequestHeader('content-type', 'application/octet-stream')
      xhr.setRequestHeader('Authorization', 'Bearer token')
    }
  }
})

player.context.hls.options.config = {
  // ...
}
```
