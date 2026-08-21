export type PlaygroundSample = {
  id: string
  label: string
  code: string
}

export const PLAYGROUND_SAMPLES: PlaygroundSample[] = [
  {
    id: 'basic',
    label: 'Basic',
    code: `import Player from '@nusaplayer/react'
import ui from '@nusaplayer/ui'

export default function App() {
  return (
    <Player
      source={{
        src: 'https://vjs.zencdn.net/v/oceans.mp4',
        poster: 'https://vjs.zencdn.net/v/oceans.png',
        title: "Disney's Oceans"
      }}
      plugins={[
        ui({
          screenshot: true,
          pictureInPicture: true,
          keyboard: { global: true }
        })
      ]}
    />
  )
}
`
  },
  {
    id: 'hls',
    label: 'HLS',
    code: `import Player from '@nusaplayer/react'
import ui from '@nusaplayer/ui'
import hls from '@nusaplayer/hls'

export default function App() {
  return (
    <Player
      source={{
        src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        poster: 'https://d2zihajmogu5jn.cloudfront.net/big-buck-bunny/bbb.png',
        title: 'Big Buck Bunny'
      }}
      plugins={[ui(), hls({ forceHLS: true })]}
    />
  )
}
`
  },
  {
    id: 'fallback',
    label: 'Fallback',
    code: `import Player from '@nusaplayer/react'
import ui from '@nusaplayer/ui'
import hls from '@nusaplayer/hls'

export default function App() {
  return (
    <Player
      source={[
        {
          src: 'https://example.invalid/missing.m3u8',
          format: 'hls',
          title: 'Broken HLS'
        },
        {
          src: 'https://vjs.zencdn.net/v/oceans.mp4',
          poster: 'https://vjs.zencdn.net/v/oceans.png',
          title: "Disney's Oceans"
        }
      ]}
      plugins={[
        ui({ keyboard: { global: true } }),
        hls({ forceHLS: true })
      ]}
    />
  )
}
`
  },
  {
    id: 'vast',
    label: 'VAST',
    code: `import Player from '@nusaplayer/react'
import ui from '@nusaplayer/ui'
import hls from '@nusaplayer/hls'
import { ad } from '@nusaplayer/plugins'

export default function App() {
  return (
    <Player
      source={{
        src: 'https://vjs.zencdn.net/v/oceans.mp4',
        poster: 'https://vjs.zencdn.net/v/oceans.png',
        title: "Disney's Oceans"
      }}
      plugins={[
        ui({ keyboard: { global: true } }),
        hls({ qualityControl: false }),
        ad({
          autoplay: true,
          plugins: [hls({ qualityControl: false })],
          vast:
            'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=' +
            Date.now()
        })
      ]}
    />
  )
}
`
  },
  {
    id: 'playlist',
    label: 'Playlist',
    code: `import Player from '@nusaplayer/react'
import ui from '@nusaplayer/ui'
import hls from '@nusaplayer/hls'
import dash from '@nusaplayer/dash'
import { Playlist } from '@nusaplayer/plugins'

export default function App() {
  return (
    <Player
      source={{
        src: 'https://vjs.zencdn.net/v/oceans.mp4',
        poster: 'https://vjs.zencdn.net/v/oceans.png',
        title: "Disney's Oceans"
      }}
      plugins={[
        ui({ keyboard: { global: true } }),
        hls({ forceHLS: true }),
        dash(),
        new Playlist({
          initialIndex: 0,
          autoNext: true,
          sources: [
            {
              title: "Disney's Oceans - MP4",
              src: 'https://vjs.zencdn.net/v/oceans.mp4',
              poster: 'https://vjs.zencdn.net/v/oceans.png',
              duration: '00:46'
            },
            {
              title: 'Big Buck Bunny - HLS',
              src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
              poster: 'https://d2zihajmogu5jn.cloudfront.net/big-buck-bunny/bbb.png',
              duration: '10:34'
            },
            {
              title: 'Big Buck Bunny - DASH',
              src: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd',
              poster: 'https://d2zihajmogu5jn.cloudfront.net/big-buck-bunny/bbb.png',
              duration: '10:34'
            }
          ]
        })
      ]}
    />
  )
}
`
  },
  {
    id: 'danmaku',
    label: 'Danmaku',
    code: `import Player from '@nusaplayer/react'
import ui from '@nusaplayer/ui'
import Danmaku from '@nusaplayer/danmaku'

export default function App() {
  return (
    <Player
      source={{
        src: 'https://vjs.zencdn.net/v/oceans.mp4',
        poster: 'https://vjs.zencdn.net/v/oceans.png',
        title: "Disney's Oceans"
      }}
      plugins={[
        ui({
          keyboard: { global: true },
          highlight: {
            source: [
              { time: 4, text: 'Intro' },
              { time: 14, text: 'Plugins' },
              { time: 29, text: 'Keyboard' }
            ]
          },
          subtitle: {
            source: [
              { name: 'English', default: true, src: '/demo/en.srt' },
              { name: 'Indonesia', src: '/demo/id.srt' }
            ]
          }
        }),
        new Danmaku({
          enable: true,
          displaySender: true,
          source: '/demo/danmaku.xml'
        })
      ]}
    />
  )
}
`
  },
  {
    id: 'flv',
    label: 'FLV',
    code: `import Player from '@nusaplayer/react'
import ui from '@nusaplayer/ui'
import mpegts from '@nusaplayer/mpegts'

export default function App() {
  return (
    <Player
      source={{
        src: 'https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-360p.flv',
        format: 'flv',
        title: 'FLV demo'
      }}
      plugins={[ui(), mpegts()]}
    />
  )
}
`
  }
]

export function toLiveCode(source: string) {
  let code = source
    .replace(/^\s*import(?:\s+type)?\s+[\s\S]*?from\s+['"][^'"]+['"]\s*;?\s*$/gm, '')
    .replace(/export\s+default\s+function\s+/g, 'function ')
    .replace(/export\s+default\s+/g, 'const App = ')
    .trim()

  if (!/\brender\s*\(/.test(code)) {
    code += '\n\nrender(<App />)'
  }

  return code
}
