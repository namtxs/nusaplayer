# NusaPlayer Core

Playback engine for NusaPlayer.

## Basic

```js
import Player from '@nusaplayer/core'
import ui from '@nusaplayer/ui'

const player = Player.make('#player', {
  lang: 'id',
  source: {
    src: 'https://vjs.zencdn.net/v/oceans.mp4'
  }
})
  .use([ui()])
  .create()
```

UMD global: `NusaPlayer`
