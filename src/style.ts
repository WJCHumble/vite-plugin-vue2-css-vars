
import { RawSourceMap } from '@vue/component-compiler-utils/dist/types';
import postcss from 'postcss'
import { TransformResult } from 'vite';
import { cssVarsPlugin } from "./cssVars"

export async function transformStyle(
  code: string, 
  id: string
): Promise<TransformResult> {
  const { css } = await postcss([cssVarsPlugin({ id })]).process(code, {from: undefined});
  return {
    code: css,
    map: null
  };
}