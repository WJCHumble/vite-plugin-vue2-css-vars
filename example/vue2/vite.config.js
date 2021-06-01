import { defineConfig } from 'vite'
import { createVuePlugin } from "vite-plugin-vue2"
import vitePluginVue2CssVars from "../../src/index"
// import vitePluginVue2CssVars from "../../dist/index.mjs"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vitePluginVue2CssVars(), createVuePlugin()],
})
