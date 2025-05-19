import { reactRouter } from '@react-router/dev/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { spawn } from 'node:child_process'
import { livestoreDevtoolsPlugin } from '@livestore/devtools-vite'

export default defineConfig({
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 60_001,
  },
  worker: { format: 'es' },
  plugins: [
    livestoreDevtoolsPlugin({ schemaPath: './app/livestore/schema.ts' }),
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    reactRouter(),
    // Running `wrangler dev` as part of `vite dev` needed for `@livestore/sync-cf`
    {
      name: 'wrangler-dev',
      configureServer: async (server) => {
        const wrangler = spawn(
          './node_modules/.bin/wrangler',
          ['dev', '--port', '8787'],
          {
            stdio: ['ignore', 'inherit', 'inherit'],
            shell: true,
          }
        )

        server.httpServer?.on('close', () => wrangler.kill())

        wrangler.on('exit', (code) =>
          console.error(`wrangler dev exited with code ${code}`)
        )
      },
    },
  ],
})
