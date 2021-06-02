import { Plugin } from 'vite'
import hashsum from 'hash-sum'
import { parseVueRequest } from './utils/query'
import { transformMain } from "./main"
import { transformStyle } from "./style"

export default function vitePluginVue2CssVars(): Plugin {
  let isProd = false

  return {
    name: 'vite-plugin-vue2-css-vars',
    config(_config, {command}) {
      if (command === 'build') {
        isProd = true
      }
    },
    async transform(code: string, id: string) {
      const { query, filename } = parseVueRequest(id)
      const shortId = hashsum(filename)
      
      if (!(/\.vue$/.test(filename)) && !query.vue) {
        return
      }
      // resolve main request
      if (!query.vue) {
        return await transformMain(code, filename, shortId, isProd)
      }
      // resolve sub block request
      if (query.type === "style") {
        return await transformStyle(code, shortId)
      }
    },
  }
}
