import { defineConfig } from 'vite'
import { createVuePlugin } from "vite-plugin-vue2"
// import vitePluginVue2CssVars from "vite-plugin-vue2-css-vars"
// import vitePluginVue2CssVars from "../../dist/index"
import vitePluginVue2CssVars from "../../src/index"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vitePluginVue2CssVars(), createVuePlugin()],
})
