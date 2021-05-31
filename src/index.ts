import { Plugin } from 'vite'
import { createFilter } from '@rollup/pluginutils'
import compiler from 'vue-template-compiler'
import { parse } from '@vue/component-compiler-utils'
import { VueTemplateCompiler } from '@vue/component-compiler-utils/dist/types'
import postcss from 'postcss'
import { parseVueRequest, cssVarsPlugin } from './utils'

export default function vitePluginVue2CssVars(Options: Record<string, string> = {}): Plugin {
  const filter = createFilter(
    Options.include || /\.vue$/,
    Options.exclude,
  )

  return {
    name: 'vite-plugin-vue2-css-vars',
    async transform(code: any, id: string) {
      const { filename, query } = parseVueRequest(id)
      if (!query.vue && !filter(filename))
        return

      const { template, styles, script } = parse({
        source: code,
        filename,
        needMap: true,
        compiler: compiler as VueTemplateCompiler,
      })
      // TODO: inject watch on mounted
      // rewrite css variable
      const { css } = await postcss([cssVarsPlugin]).process(styles[0], {})
      return code
    },
  }
}
