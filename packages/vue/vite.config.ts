import { LibraryOptions } from 'vite'
import { viteConfig } from '../../vite.config'

export default viteConfig('vue', {
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'NusaVue'
    } as LibraryOptions
  }
})
