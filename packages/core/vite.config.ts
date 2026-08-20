import { LibraryOptions } from 'vite'
import { viteConfig } from '../../vite.config'

export default viteConfig('core', {
  build: {
    lib: { name: 'NusaPlayer', formats: ['es'] } as LibraryOptions
  }
})
