import Link from 'next/link'
import Player from '@nusaplayer/react'
import hls from '@nusaplayer/hls'
import dash from '@nusaplayer/dash'
import mpegts from '@nusaplayer/mpegts'
import ui from '@nusaplayer/ui'
import Danmaku from '@nusaplayer/danmaku'
import { Playlist } from '@nusaplayer/plugins'
import { DEMO, HIGHLIGHTS } from '../samples'

const plugins = [
  ui({
    theme: {
      primaryColor: '#fb7299',
      controller: { header: true, slideToSeek: 'always', setting: 'auto' },
      progress: { position: 'top' }
    },
    pictureInPicture: true,
    screenshot: true,
    keyboard: { global: true }
  }),
  hls({ forceHLS: true }),
  dash(),
  mpegts(),
  new Danmaku({ enable: true, displaySender: true, fontSize: 0.75 }),
  new Playlist({
    initialIndex: 0,
    autoNext: true,
    sources: [
      {
        title: "Disney's Oceans - MP4",
        src: DEMO.mp4,
        poster: DEMO.poster,
        duration: '00:46',
        danmaku: DEMO.danmaku,
        subtitles: [
          { name: 'English', default: true, src: DEMO.enSrt },
          { name: 'Indonesia', src: DEMO.idSrt }
        ],
        highlights: HIGHLIGHTS
      },
      {
        title: 'Big Buck Bunny - HLS',
        src: DEMO.hls,
        poster: DEMO.bbbPoster,
        duration: '10:34'
      },
      {
        title: 'Big Buck Bunny - DASH',
        src: DEMO.dash,
        poster: DEMO.bbbPoster,
        duration: '10:34'
      },
      {
        title: 'FLV',
        src: DEMO.flv,
        format: 'flv'
      }
    ]
  })
]

export default function Home() {
  return (
    <div className="np-home">
      <header className="np-bar">
        <strong>NusaPlayer</strong>
        <nav>
          <Link href="/docs/">docs</Link>
          <Link href="/playground/">playground</Link>
          <Link href="/player/">streams</Link>
        </nav>
      </header>
      <div className="np-demo">
        <Player
          aspectRatio={0}
          volume={0.6}
          source={{
            src: DEMO.mp4,
            poster: DEMO.poster,
            title: "Disney's Oceans"
          }}
          plugins={plugins}
        />
      </div>
      <footer className="np-foot">
        <code>Player.make(el).use([ui()]).create()</code>
        <span>playlist · subtitle · danmaku</span>
      </footer>
    </div>
  )
}
