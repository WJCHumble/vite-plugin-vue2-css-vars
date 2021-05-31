export interface VueQuery {
  vue: boolean
  src: boolean
  index: number
  type: string
}

export interface PaserVueRequestResult {
  filename: string
  query: VueQuery
}

export interface CssVarsPluginOptions {
  id: string
  isProd?: boolean
}
