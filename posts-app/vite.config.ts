import build from '@hono/vite-cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import { defineConfig } from 'vite'
import { getEnv } from '@hono/vite-dev-server/cloudflare-pages'

// NOTE: WranglerのgetPlatformProxy関数を使うと、より簡潔に設定ができます
// - https://github.com/syumai/sd-cloudflare-examples/blob/use-get-platform-proxy-in-vite-config/posts-app/vite.config.ts#L7
export default defineConfig({
  plugins: [
    build(),
    devServer({
      entry: 'src/index.tsx',
      env: getEnv({
        d1Databases: ['DB'],
        d1Persist: '.wrangler/state/v3/d1',
      }),
    }),
  ],
})
