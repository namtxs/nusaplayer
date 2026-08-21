import type { Source } from './types'

export function normalizeSources(source?: Source | Source[] | string): Source[] {
  if (source == null || source === '') return [{ src: '' }]
  if (typeof source === 'string') return [{ src: source }]
  if (Array.isArray(source)) {
    const list = source.filter((item) => Boolean(item?.src))
    return list.length ? list : [{ src: '' }]
  }
  return [{ ...source, src: source.src ?? '' }]
}
