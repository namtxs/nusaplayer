# @nusaplayer/dash

[![npm](https://img.shields.io/npm/v/@nusaplayer/dash?style=flat-square&label=@nusaplayer/dash)](https://www.npmjs.com/package/@nusaplayer/dash)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@nusaplayer/dash?style=flat-square)
[![npm dm](https://img.shields.io/npm/dm/@nusaplayer/dash?style=flat-square)](https://www.npmjs.com/package/@nusaplayer/dash)
[![jsdelivr](https://data.jsdelivr.com/v1/package/npm/@nusaplayer/dash/badge)](https://www.jsdelivr.com/package/npm/@nusaplayer/dash)

[MPEG-DASH](https://github.com/Dash-Industry-Forum/dash.js) plugin for NusaPlayer.

## Install

```bash
npm i @nusaplayer/core @nusaplayer/dash dashjs
```

```html
<script src="https://cdn.jsdelivr.net/npm/@nusaplayer/core@latest/dist/index.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@nusaplayer/dash@latest/dist/index.min.js"></script>

<div id="player"></div>

<script>
  var player = NusaPlayer.make('#player', {
    source: {
      src: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd'
    }
  })
    .use([NusaDash({ library: 'https://cdn.dashjs.org/v4.7.4/dash.all.min.js' })])
    .create()
</script>
```

## DRM

```ts
NusaDash({
  drm: {
    'com.widevine.alpha': {
      serverURL: 'https://drm-widevine-licensing.axtest.net/AcquireLicense',
      httpRequestHeaders: {
        'X-AxDRM-Message': 'token'
      },
      priority: 0
    }
  }
})

player.context.dash.options.drm = {
  // ...
}
```
