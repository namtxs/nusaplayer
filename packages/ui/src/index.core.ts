import { Player } from '@nusaplayer/core'
import ui from './index'

export default Player
export * from '@nusaplayer/core'

if (globalThis.window) {
  ;(<any>globalThis.window).NusaUI = ui
}
