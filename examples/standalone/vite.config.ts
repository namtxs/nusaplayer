import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ConfigEnv, defineConfig } from 'vite'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const pkgSrc = (name: string, entry = 'src/index.ts') => path.join(root, 'packages', name, entry)

export default defineConfig((_: ConfigEnv) => ({
  assetsInclude: ['**/*.srt', '**/*.xml', '**/*.flv'],
  define: {
    __VERSION__: JSON.stringify('dev')
  },
  resolve: {
    alias: {
      '@nusaplayer/core': pkgSrc('core'),
      '@nusaplayer/ui': pkgSrc('ui'),
      '@nusaplayer/hls': pkgSrc('hls'),
      '@nusaplayer/dash': pkgSrc('dash'),
      '@nusaplayer/mpegts': pkgSrc('mpegts'),
      '@nusaplayer/danmaku': pkgSrc('danmaku'),
      '@nusaplayer/shaka': pkgSrc('shaka'),
      '@nusaplayer/torrent': pkgSrc('torrent'),
      '@nusaplayer/plugins': pkgSrc('plugins', 'index.ts')
    }
  },
  plugins: [
    {
      name: 'ignore-external-in-dev-runtime',
      resolveId(source) {
        if (source == 'webtorrent/webtorrent.min.js') {
          return { id: 'ignore-external-in-dev-runtime' }
        }

        return null
      },
      load(id) {
        if (id == 'ignore-external-in-dev-runtime') {
          return 'export default function G(){ throw Error("oh~~~~ webtorrent not found!") }'
        }
        return null
      }
    }
  ]
}))
