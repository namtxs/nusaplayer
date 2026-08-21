import ui from '@nusaplayer/ui'
import hls from '@nusaplayer/hls'
import dash from '@nusaplayer/dash'
import mpegts from '@nusaplayer/mpegts'
import torrent from '@nusaplayer/torrent'
import shaka from '@nusaplayer/shaka'

import Player from '@nusaplayer/core'

export default Player
export * from '@nusaplayer/core'

if (globalThis.window) {
  ;(globalThis.window as any).NusaUI = ui
  ;(globalThis.window as any).NusaHls = hls
  ;(globalThis.window as any).NusaDash = dash
  ;(globalThis.window as any).NusaMpegts = mpegts
  ;(globalThis.window as any).NusaTorrent = torrent
  ;(globalThis.window as any).NusaShaka = shaka
}
