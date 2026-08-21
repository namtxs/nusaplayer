# @nusaplayer/react

[![npm](https://img.shields.io/npm/v/@nusaplayer/react?style=flat-square&label=@nusaplayer/react)](https://www.npmjs.com/package/@nusaplayer/react)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@nusaplayer/react?style=flat-square)
[![npm dm](https://img.shields.io/npm/dm/@nusaplayer/react?style=flat-square)](https://www.npmjs.com/package/@nusaplayer/react)

React wrapper for NusaPlayer.

## Install

```bash
npm i @nusaplayer/core @nusaplayer/react
```

```tsx
import ReactPlayer from '@nusaplayer/react'

const plugins = [
  ui({
    pictureInPicture: true,
    slideToSeek: 'always',
    screenshot: true,
    keyboard: { global: true }
  }),
  hls()
]

function PlayPage() {
  const [source, setSource] = useState<any>()
  const player = useRef<Player>(null)

  useEffect(() => {
    setSource(fetch(`xxxx`).then((it) => it))
  }, [lastEpisode])

  return (
    <ReactPlayer
      plugins={plugins}
      ref={player}
      autoplay={true}
      source={source}
      duration={lastDuration}
      isLive={id == 'iptv'}
      onEvent={(e) => {}}
    />
  )
}
```
