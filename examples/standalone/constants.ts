export const DEMO = {
  mp4: 'https://vjs.zencdn.net/v/oceans.mp4',
  poster: 'https://vjs.zencdn.net/v/oceans.png',
  hls: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  bbbPoster: 'https://d2zihajmogu5jn.cloudfront.net/big-buck-bunny/bbb.png',
  dash: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd',
  hlsMulti: 'https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8',
  dashMulti: 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd',
  flv: 'https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-360p.flv',
  torrent: 'https://webtorrent.io/torrents/sintel.torrent',
  enSrt: '/demo/en.srt',
  styledVtt: '/demo/styled.vtt',
  idSrt: '/demo/id.srt',
  danmaku: '/demo/danmaku.xml'
}

export const highlight = [
  { time: 4, text: 'Intro' },
  { time: 14, text: 'Subtitles & plugins' },
  { time: 29, text: 'Keyboard' },
  { time: 40, text: 'End' }
]

export const FORMAT_MENU = [
  { name: 'MP4', default: true, value: DEMO.mp4 },
  { name: 'HLS', value: DEMO.hls },
  { name: 'DASH', value: DEMO.dash },
  { name: 'FLV', value: DEMO.flv }
]
