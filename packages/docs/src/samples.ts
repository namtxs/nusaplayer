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
} as const

export const HIGHLIGHTS = [
  { time: 4, text: 'Intro' },
  { time: 14, text: 'Subtitles & plugins' },
  { time: 29, text: 'Keyboard' },
  { time: 40, text: 'End' }
]

export const SAMPLE_SOURCES = [
  {
    id: 'mp4',
    label: 'MP4 · Oceans',
    format: 'auto' as const,
    src: DEMO.mp4,
    poster: DEMO.poster,
    title: "Disney's Oceans"
  },
  {
    id: 'hls',
    label: 'HLS · Big Buck Bunny',
    format: 'hls' as const,
    src: DEMO.hls,
    poster: DEMO.bbbPoster,
    title: 'Big Buck Bunny'
  },
  {
    id: 'dash',
    label: 'DASH · Big Buck Bunny',
    format: 'dash' as const,
    src: DEMO.dash,
    poster: DEMO.bbbPoster,
    title: 'Big Buck Bunny'
  },
  {
    id: 'hls-multi',
    label: 'HLS · multi quality',
    format: 'hls' as const,
    src: DEMO.hlsMulti,
    title: 'Angel One HLS'
  },
  {
    id: 'dash-multi',
    label: 'DASH · multi quality',
    format: 'dash' as const,
    src: DEMO.dashMulti,
    title: 'Angel One DASH'
  },
  {
    id: 'flv',
    label: 'FLV',
    format: 'flv' as const,
    src: DEMO.flv,
    title: 'FLV demo'
  },
  {
    id: 'torrent',
    label: 'WebTorrent · Sintel',
    format: 'auto' as const,
    src: DEMO.torrent,
    title: 'Sintel'
  }
]
