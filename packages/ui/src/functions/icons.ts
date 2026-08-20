import expandSvg from '../icons/fullscreen-enter.svg?raw'
import compressSvg from '../icons/fullscreen-exit.svg?raw'
import webfsEnterSvg from '../icons/webfs-enter.svg?raw'
import webfsExitSvg from '../icons/webfs-exit.svg?raw'
import loopSvg from '../icons/loop.svg?raw'
import pauseSvg from '../icons/pause.svg?raw'
import pipEnterSvg from '../icons/pip-enter.svg?raw'
import pipExitSvg from '../icons/pip-exit.svg?raw'
import playSvg from '../icons/play.svg?raw'
import screenshotSvg from '../icons/screenshot.svg?raw'
import settingsSvg from '../icons/settings.svg?raw'
import volumeOffSvg from '../icons/sound-off.svg?raw'
import volumeSvg from '../icons/sound-on.svg?raw'
import speedSvg from '../icons/speed.svg?raw'
import subtitleSvg from '../icons/subtitles.svg?raw'
import qualitySvg from '../icons/quality.svg?raw'
import langSvg from '../icons/lang.svg?raw'
import audioSvg from '../icons/audio.svg?raw'
import progressIndicatorSvg from '../icons/progress-indicator.svg?raw'
import chromecastSvg from '../icons/chromecast.svg?raw'
import airplaySvg from '../icons/airplay.svg?raw'
import danmakuSvg from '../icons/danmaku.svg?raw'
import playlistSvg from '../icons/playlist.svg?raw'

import type { UiConfig } from '../types'

export const ICONS_MAP = {
  play: playSvg,
  pause: pauseSvg,
  volume: [volumeSvg, volumeOffSvg],
  fullscreen: [expandSvg, compressSvg],
  webfullscreen: [webfsEnterSvg, webfsExitSvg],
  pip: [pipEnterSvg, pipExitSvg],
  setting: settingsSvg,
  screenshot: screenshotSvg,
  playbackRate: speedSvg,
  subtitle: subtitleSvg,
  loop: loopSvg,
  quality: qualitySvg,
  lang: langSvg,
  audio: audioSvg,
  progressIndicator: progressIndicatorSvg,
  loadingIndicator: null,
  previous: null,
  next: null,
  // plugins
  chromecast: chromecastSvg,
  airplay: airplaySvg,
  danmaku: danmakuSvg,
  playlist: playlistSvg
}

export namespace Icons {
  export const setupIcons = (icons: UiConfig['icons']) => {
    for (const key in icons) {
      if (Object.prototype.hasOwnProperty.call(icons, key)) {
        ICONS_MAP[key as keyof UiConfig['icons']] = icons[key as keyof UiConfig['icons']]
      }
    }

    return ICONS_MAP
  }

  export const get = <K extends keyof typeof ICONS_MAP>(name: K): (typeof ICONS_MAP)[K] => ICONS_MAP[name]!
}
