import qs from 'querystring'
import { PaserVueRequestResult, VueQuery } from '../types'

export function parseVueRequest(id: string): PaserVueRequestResult {
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
