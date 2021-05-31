import { Plugin } from 'vite'

export default function vitePluginVue2CssVars(): Plugin {
  return {
    name: 'vite-plugin-vue2-css-vars',
    transform(code: any, id: string) {
      return code
    },
  }
}
