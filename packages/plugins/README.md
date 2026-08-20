## Plugins

```shell
npm i @nusaplayer/plugins
```

```js
import { Playlist, Chromecast, AirPlay, ad, vttThumbnails } from '@nusaplayer/plugins'
```

```html
<!-- All plugins -->
<script src="https://cdn.jsdelivr.net/npm/@nusaplayer/plugins@latest/dist/index.min.js"></script>

<!-- Playlist -->
<script src="https://cdn.jsdelivr.net/npm/@nusaplayer/plugins@latest/dist/playlist.min.js"></script>

<!-- VTT Thumbnails -->
<script src="https://cdn.jsdelivr.net/npm/@nusaplayer/plugins@latest/dist/vttThumbnails.min.js"></script>

<!-- Chromecast -->
<script src="https://cdn.jsdelivr.net/npm/@nusaplayer/plugins@latest/dist/chromecast.min.js"></script>

<!-- AirPlay -->
<script src="https://cdn.jsdelivr.net/npm/@nusaplayer/plugins@latest/dist/airplay.min.js"></script>

<!-- AD -->
<script src="https://cdn.jsdelivr.net/npm/@nusaplayer/plugins@latest/dist/ad.min.js"></script>
```

### Playlist

```js
Player.make('#player')
  .use([
    new Playlist({
      initialIndex: 0, // default
      autoNext: true, // default
      autoHide: true, // default
      sources: [
        {
          title: 'Oceans - MP4',
          src: 'https://vjs.zencdn.net/v/oceans.mp4',
          duration: '00:46'
        },
        {
          title: 'Big Buck Bunny - HLS',
          src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          duration: '10:34'
        },
        {
          title: 'DASH',
          src: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd',
          duration: '10:34'
        }
      ]
    })
  ])
  .create()

player.context.playlist.next() // play next
player.context.playlist.previous() // play previous
player.context.playlist.showUI() // show list UI
player.context.playlist.hideUI() // hide list UI
player.context.playlist.changeSourceList([]) //change playlist sources
```

### VTT Thumbnails

```js
Player.make('#player')
  .use([vttThumbnails({ src: 'your-file-path' })])
  .create()
```

### Chromecast

```js
Player.make('#player').use([new Chromecast()]).create()
```

### AirPlay

```js
Player.make('#player').use([new AirPlay()]).create()
```

### AD

```js
Player.make('#player').use([
  ui(),
  ad({
    duration: 10,
    skipDuration: 5,
    image: 'https://vjs.zencdn.net/v/oceans.png',
    target: 'https://vjs.zencdn.net/v/oceans.mp4'
  })
]).create()
```
