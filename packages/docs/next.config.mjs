import createMDX from '@next/mdx'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'

/** @type {import('rehype-pretty-code').Options} */
const prettyCode = {
  theme: 'github-dark-dimmed',
  keepBackground: false,
  defaultLang: { block: 'plaintext' },
  filterMetaString: (meta) => meta.replaceAll(/\bfilename=/g, 'title=')
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrettyCode, prettyCode]],
    providerImportSource: '@mdx-js/react'
  }
})

export default withMDX({
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  output: 'export',
  reactStrictMode: true,
  trailingSlash: true,
  transpilePackages: [
    '@nusaplayer/core',
    '@nusaplayer/ui',
    '@nusaplayer/plugins',
    '@nusaplayer/hls',
    '@nusaplayer/dash',
    '@nusaplayer/mpegts',
    '@nusaplayer/shaka',
    '@nusaplayer/torrent',
    '@nusaplayer/danmaku',
    '@nusaplayer/react',
    '@nusaplayer/vue'
  ],
  images: {
    unoptimized: true
  },
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx']
    }
    config.infrastructureLogging = {
      level: 'error'
    }
    return config
  }
})
