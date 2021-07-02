import { VueTemplateCompiler } from '@vue/component-compiler-utils/dist/types'
import { parse as SFCParse } from '@vue/component-compiler-utils'
import * as vueTemplateCompiler from 'vue-template-compiler'
import { transformStyle } from "./style"
import { parseCssVars, genCssVarsCode } from "./cssVars"
import { TransformResult } from 'vite'
import { init, parse } from "es-module-lexer"

export async function transformMain(
  code: string, 
  filename: string, 
  id: string,
  isProd: boolean
 ): Promise<TransformResult> {
  const { template, styles, script } = SFCParse({
    source: code,
    filename: filename,
    needMap: true,
    compiler: vueTemplateCompiler as VueTemplateCompiler
  });

  // sfc hasn't style block
  if (!styles.length) {
    return
  }

  const {code: css} = await transformStyle(styles[0].content, id)
  const attrs = await parseCssVars(styles)
  // In prod mode, will not auto inject useCssVars code without vars attr in <style> block
  if (isProd && !styles[0].attrs.vars) {
    return
  }
  // use v-bind(), but no use vars attr in <style> block
  if (!styles[0].attrs.vars && attrs.length) {
    throw new Error(`If you use v-bind() in <style> block, you should add vars attr in <style>.`)
  }
  // resolve the import
  await init
  const [imports] = parse(script.content)

  let importCode = "", exportDefaultCode = script.content
  if (imports.length) {
    importCode = script.content.substring(imports[0]["ss"], imports[imports.length - 1]["se"])
    exportDefaultCode = script.content.substring(imports[imports.length - 1]["se"])
  }
  // generate useCssVars code
  const useCssVarsCode = genCssVarsCode(attrs, id)
  const insertIndex = exportDefaultCode.indexOf("{") + 1
  // rewrite sfc file
  code = `<template>
${template.content}
</template>
<script>
${importCode}
${exportDefaultCode.slice(0, insertIndex)}${useCssVarsCode}${exportDefaultCode.slice(insertIndex)}
</script>
<style scoped ${Object.keys(styles[0].attrs).filter(key => key !== 'scoped')
                                        .map(key => `${key}='${styles[0].attrs[key]}'`)
                                        .join(" ")}>
${css}
</style>`

  return {
    code: code,
    map: null
  }
}
