import { Plugin } from 'vite'
import { createFilter } from '@rollup/pluginutils'
import compiler from 'vue-template-compiler'
import { parse } from '@vue/component-compiler-utils'
import { VueTemplateCompiler } from '@vue/component-compiler-utils/dist/types'
import postcss from 'postcss'
import hashsum from 'hash-sum'
import { parseVueRequest, cssVarsPlugin, parseCssVars } from './utils'

export default function vitePluginVue2CssVars(Options: Record<string, string> = {}): Plugin {
  const filter = createFilter(
    Options.include || /\.vue$/,
    Options.exclude,
  )

  return {
    name: 'vite-plugin-vue2-css-vars',
    async transform(code: string, id: string) {
      const { query, filename } = parseVueRequest(id)
      const shortId = hashsum(filename)
      if (!filter(filename) || query.type) {
        // resolve style hmr
        if (query.type && query.type === "style") {
          const { css } = await postcss([cssVarsPlugin({ id: shortId })]).process(code);
          return {
            code: css,
            map: null
          };
        }

        return
      }
      const { template, styles, script } = parse({
        source: code,
        filename: filename,
        needMap: true,
        compiler: compiler as VueTemplateCompiler
      });
      // rewrite css
      const { css } = await postcss([cssVarsPlugin({ id: shortId })]).process(styles[0].content)
      // inject vueCssVars code
      const attrs = parseCssVars(styles)
      const watchVarCode = attrs.map(attr => `
    this.$watch('${attr}', function(nVal) { 
      const vnode = this._vnode 
      this._setVnodeVar(vnode, '--${shortId}-${attr}', nVal)
    }, { immediate: true })`).join(";")
        const insertIndex = script.content.indexOf("{") + 1
        const useCssVarsCode = `
  mounted() {
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
    ${watchVarCode}
  },`
      code = `<template>\n ${template.content} \n</template>\n<script>\n ${script.content.slice(0, insertIndex)}${useCssVarsCode}${script.content.slice(insertIndex)} \n</script>\n<style scoped ${Object.keys(styles[0].attrs).filter(key => key !== 'scoped').map(key => `${key}='${styles[0].attrs[key]}'`).join(" ")}>\n ${css} \n</style>`
      return {
        code: code,
        map: null
      }
    },
  }
}
