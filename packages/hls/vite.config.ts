import { LibraryOptions } from 'vite'
import { viteConfig } from '../../vite.config'

export default viteConfig('hls', {
  build: {
    lib: { name: 'NusaHls' } as LibraryOptions
  }
})
