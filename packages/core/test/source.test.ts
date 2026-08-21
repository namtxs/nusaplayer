import { describe, expect, it } from 'vitest'
import { normalizeSources } from '../src/source'

describe('normalizeSources', () => {
  it('wraps a single source', () => {
    expect(normalizeSources({ src: 'a.mp4', title: 'A' })).toEqual([{ src: 'a.mp4', title: 'A' }])
  })

  it('accepts a URL string', () => {
    expect(normalizeSources('https://example.com/a.mp4')).toEqual([{ src: 'https://example.com/a.mp4' }])
  })

  it('keeps a list in order and drops empty src', () => {
    expect(
      normalizeSources([{ src: 'broken.m3u8' }, { src: '' }, { src: 'ok.mp4', title: 'OK' }])
    ).toEqual([{ src: 'broken.m3u8' }, { src: 'ok.mp4', title: 'OK' }])
  })

  it('returns an empty source when nothing is usable', () => {
    expect(normalizeSources()).toEqual([{ src: '' }])
    expect(normalizeSources('')).toEqual([{ src: '' }])
    expect(normalizeSources([])).toEqual([{ src: '' }])
    expect(normalizeSources([{ src: '' }])).toEqual([{ src: '' }])
  })
})
