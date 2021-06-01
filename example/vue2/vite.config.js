import { defineConfig } from 'vite'
import { createVuePlugin } from "vite-plugin-vue2"
import vitePluginVue2CssVars from "../../src/index"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [createVuePlugin(), vitePluginVue2CssVars()],
})
