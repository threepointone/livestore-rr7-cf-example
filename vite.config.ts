import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
// import { livestoreDevtoolsPlugin } from "@livestore/devtools-vite";
import devToolsJson from "vite-plugin-devtools-json";

export default defineConfig({
  // server: {
  //   port: process.env.PORT ? Number(process.env.PORT) : 60_001,
  // },
  optimizeDeps: {
    exclude: ["@livestore/wa-sqlite"],
  },
  worker: { format: "es" },
  plugins: [
    devToolsJson(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    // this is causing the "invoke was called before connect" error
    // livestoreDevtoolsPlugin({ schemaPath: "./app/livestore/schema.ts" }),
    reactRouter(),
  ],
});
