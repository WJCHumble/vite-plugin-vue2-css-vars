import { Plugin } from 'vite'
import { createFilter } from '@rollup/pluginutils'
import compiler from 'vue-template-compiler'
import { parse } from '@vue/component-compiler-utils'
import { VueTemplateCompiler } from '@vue/component-compiler-utils/dist/types'
import postcss from 'postcss'
import hashsum from 'hash-sum'
import { parseVueRequest, cssVarsPlugin } from './utils'

export default function vitePluginVue2CssVars(Options: Record<string, string> = {}): Plugin {
  const filter = createFilter(
    Options.include || /\.vue$/,
    Options.exclude,
  )

  return {
    name: 'vite-plugin-vue2-css-vars',
    async transform(code: string, id: string) {
      const { query, filename } = parseVueRequest(id)
      if (query.type === 'style') {
        const { css } = await postcss([cssVarsPlugin({ id: hashsum(filename) })]).process(code)
        return css
      }
      if (!Object.keys(query).length && filter(id)) {
        code = code.replace('const script', 'let script')
        const insertIndex = code.indexOf('var component')
        const newScriptCode = `\n 
script = {
  ...script,
  mounted() {
    this.$watch('color', function(nVal) {
      if (!this._setVnodeVar) {
        this._setVnodeVar = function(vnode, value) {
          if (!vnode.tag) {
            return
          }

          vnode.elm.style.setProperty("--84b0babe-color", value)
          if (vnode.children && vnode.children.length) {
            vnode.children.forEach((childVnode) => {
              this._setVnodeVar(childVnode, value);
            });
          }
        }
      }
      const vnode = this._vnode
      this._setVnodeVar(vnode, nVal)
    }, {
      immediate: true
    })
  }
} \n
`
        code = code.slice(0, insertIndex) + newScriptCode + code.slice(insertIndex)
        return code
      }
    },
  }
}
