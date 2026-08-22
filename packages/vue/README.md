# @nusaplayer/vue

[![npm](https://img.shields.io/npm/v/@nusaplayer/vue?style=flat-square&label=@nusaplayer/vue)](https://www.npmjs.com/package/@nusaplayer/vue)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@nusaplayer/vue?style=flat-square)
[![npm dm](https://img.shields.io/npm/dm/@nusaplayer/vue?style=flat-square)](https://www.npmjs.com/package/@nusaplayer/vue)

Vue 3 wrapper for NusaPlayer.

## Install

```bash
npm i @nusaplayer/core @nusaplayer/ui @nusaplayer/vue
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type Player from '@nusaplayer/core'
import NusaPlayer from '@nusaplayer/vue'
import type { VueNusaPlayerInstance } from '@nusaplayer/vue'
import ui from '@nusaplayer/ui'
import hls from '@nusaplayer/hls'

const plugins = [
  ui({
    pictureInPicture: true,
    screenshot: true,
    keyboard: { global: true }
  }),
  hls({ forceHLS: true })
]

const playerRef = ref<VueNusaPlayerInstance | null>(null)
const source = {
  src: 'https://vjs.zencdn.net/v/oceans.mp4',
  poster: 'https://vjs.zencdn.net/v/oceans.png'
}

function play() {
  const player: Player | null = playerRef.value?.player ?? null
  void player?.play()
}
</script>

<template>
  <NusaPlayer ref="playerRef" :plugins="plugins" :source="source" :volume="0.8" />
</template>
```
