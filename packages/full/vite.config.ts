import { LibraryOptions } from 'vite'
import { viteConfig } from '../../vite.config'
import { plugin } from 'vite-plugin-merge-exports'

export default viteConfig('full', {
  build: {
    lib: {
      name: 'NusaPlayer',
      formats: ['umd']
    } as LibraryOptions
  },
  plugins: [plugin()]
})
