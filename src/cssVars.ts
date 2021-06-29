

import { CssVarsPluginOptions } from './types'
import postcss, { PluginCreator } from 'postcss'
import postcssDiscardComments from "postcss-discard-comments"
import postScss from "postcss-scss"

const cssVarRE = /\bv-bind\(\s*(?:'([^']+)'|"([^"]+)"|([^'"][^)]*))\s*\)/g

function genVarName(id: string, raw: string, isProd?: boolean): string {
  return `${id}-${raw.replace(/([^\w-])/g, '_')}`
}

export const cssVarsPlugin: PluginCreator<CssVarsPluginOptions> = (opts) => {
  const { id } = opts
  return {
    postcssPlugin: 'vue-sfc-vars',
    Declaration(decl) {
      // rewrite CSS variables
      if (cssVarRE.test(decl.value)) {
        decl.value = decl.value.replace(cssVarRE, (_, $1, $2, $3) => {
          return `var(--${genVarName(id, $1 || $2 || $3)})`
        })
      }
    },
  }
}
cssVarsPlugin.postcss = true

export async function parseCssVars(styles: Array<any>): Promise<string[]> {
  // ignore the css comment code
  const { css } = await postcss([postcssDiscardComments({removeAll: true})]).process(styles[0].content, {from: undefined, parser: postScss})
  const vars: string[] = []
  let match
  while ((match = cssVarRE.exec(css))) {
    vars.push(match[1] || match[2] || match[3])
  }
  return vars
}

export function genCssVarsFromList(
  vars: string[],
  id: string,
  isProd: boolean
): string {
  return `{\n  ${vars
    .map((key) => `"${genVarName(id, key, isProd)}": (${key})`)
    .join(',\n  ')}\n}`
}

export function genCssVarsCode(
  attrs: string[],
  id: string
): string {
  const watchCode = attrs.map(attr => `
      this.$watch('${attr}', function(nVal) { 
        const vnode = this._vnode 
        this._setVnodeVar(vnode, '--${id}-${attr}', nVal)
      }, { immediate: true })\n`)

    return `
  mixins: [{
    mounted: function () {
      if (!this._setVnodeVar) {
        this._setVnodeVar = function(vnode, cssVar, value) {
          if (!vnode.tag) {
            return
          }

          vnode.elm.style.setProperty(cssVar, value)\n
          if (vnode.children && vnode.children.length) {
            vnode.children.forEach((childVnode) => {
              this._setVnodeVar(childVnode, cssVar, value);
            });
          }
        }
      }
      ${watchCode}
    }
  }],`
}