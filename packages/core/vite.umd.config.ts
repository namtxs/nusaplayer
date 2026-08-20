import { LibraryOptions } from 'vite'
import { viteConfig } from '../../vite.config'

export default viteConfig('core', {
  build: {
    emptyOutDir: false,
    lib: {
      entry: './src/index.umd.ts',
      name: 'NusaPlayer',
      formats: ['umd']
    } as LibraryOptions
  }
})
