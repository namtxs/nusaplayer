import { LibraryOptions } from 'vite'
import { viteConfig } from '../../vite.config'

export default viteConfig('mpegts', {
  build: {
    lib: { name: 'NusaMpegts' } as LibraryOptions
  }
})
