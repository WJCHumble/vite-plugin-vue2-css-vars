
import postcss from 'postcss'
import { TransformResult } from 'vite';
import { cssVarsPlugin } from "./cssVars"
import postScss from "postcss-scss"

export async function transformStyle(
  code: string, 
  id: string
): Promise<TransformResult> {
  const { css } = await postcss([cssVarsPlugin({ id })]).process(code, {from: undefined, parser: postScss});
  return {
    code: css,
    map: null
  };
}