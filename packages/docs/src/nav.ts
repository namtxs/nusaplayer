export type NavItem = { href: string; label: string } | { label: string; items?: never }

export const TOP_NAV = [
  { href: '/docs/', label: 'docs' },
  { href: '/playground/', label: 'playground' },
  { href: '/player/', label: 'streams' }
]

export const DOCS_NAV: Array<{ href?: string; label: string }> = [
  { href: '/docs/', label: 'Introduction' },
  { href: '/docs/start/', label: 'Install' },
  { href: '/docs/player-configuration/', label: 'Configuration' },
  { href: '/docs/api/', label: 'API' },
  { label: 'UI & plugins' },
  { href: '/docs/ui/', label: 'UI' },
  { href: '/docs/danmaku/', label: 'Danmaku' },
  { href: '/docs/react/', label: 'React' },
  { href: '/docs/vue/', label: 'Vue' },
  { href: '/docs/plugins/', label: 'Plugins' },
  { href: '/docs/plugins/playlist/', label: 'Playlist' },
  { href: '/docs/plugins/chromecast/', label: 'Chromecast' },
  { href: '/docs/plugins/airplay/', label: 'AirPlay' },
  { href: '/docs/plugins/ad/', label: 'Ad' },
  { href: '/docs/plugins/vtt-thumbnails/', label: 'VTT thumbnails' },
  { href: '/docs/maccms/', label: 'Apple CMS' },
  { label: 'Stream loaders' },
  { href: '/docs/hls/', label: 'HLS' },
  { href: '/docs/dash/', label: 'DASH' },
  { href: '/docs/mpegts/', label: 'FLV / MPEG-TS' },
  { href: '/docs/shaka/', label: 'Shaka' },
  { href: '/docs/torrent/', label: 'WebTorrent' }
]
