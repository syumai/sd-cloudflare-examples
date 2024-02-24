import build from '@hono/vite-cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import { defineConfig } from 'vite'
import { getPlatformProxy } from 'wrangler'

export default defineConfig(async () => {
  const proxy = await getPlatformProxy()
  return {
    plugins: [
      build(),
      devServer({
        entry: 'src/index.tsx',
        env: proxy.env,
      }),
    ],
  }
})
