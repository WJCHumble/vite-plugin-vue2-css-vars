import qs from 'querystring'
import { PluginCreator } from 'postcss'
import { PaserVueRequestResult, VueQuery, CssVarsPluginOptions } from '../types'

const cssVarRE = /\bv-bind\(\s*(?:'([^']+)'|"([^"]+)"|([^'"][^)]*))\s*\)/g

export function parseVueRequest(id): PaserVueRequestResult {
  const [filename, rawQuery] = id.split('?', 2)
  const query: VueQuery = qs.parse(rawQuery) as any
  if (query.vue != null)
    query.vue = true

  if (query.src != null)
    query.src = true

  if (query.index != null)
    query.index = Number(query.index)

  return {
    filename,
    query,
  }
}

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
