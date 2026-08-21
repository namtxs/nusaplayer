import { describe, expect, it } from 'vitest'
import { assColorToRgb, assTimeToVtt, assToVtt, srtToVtt } from '../src/components/Subtitle.utils'

describe('assColorToRgb', () => {
  it('converts ASS BGR to RGB hex', () => {
    expect(assColorToRgb('&H000000FF')).toBe('FF0000')
    expect(assColorToRgb('&H00FF00')).toBe('00FF00')
  })
})

describe('assTimeToVtt', () => {
  it('pads hours and expands centiseconds', () => {
    expect(assTimeToVtt('0:00:01.00')).toBe('00:00:01.000')
    expect(assTimeToVtt('1:02:03.45')).toBe('01:02:03.450')
  })
})

describe('assToVtt', () => {
  it('keeps bold, color, and alignment', () => {
    const vtt = assToVtt(`
[V4+ Styles]
Style: Default,Arial,20,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,2,2,10,10,10,1
[Events]
Dialogue: 0,0:00:01.00,0:00:04.00,Default,,0,0,0,,{\\an8\\b1\\c&H0000FF&}Hello{\\b0} world
`)
    expect(vtt).toContain('WEBVTT')
    expect(vtt).toContain('00:00:01.000 --> 00:00:04.000')
    expect(vtt).toContain('align:center position:50% line:10%')
    expect(vtt).toContain('<b>')
    expect(vtt).toContain('colorFF0000')
    expect(vtt).toContain('Hello')
    expect(vtt).toContain('world')
  })
})

describe('srtToVtt', () => {
  it('adds a WEBVTT header and converts timestamps', () => {
    const vtt = srtToVtt('1\n00:00:01,000 --> 00:00:02,000\nHi')
    expect(vtt.startsWith('WEBVTT')).toBe(true)
    expect(vtt).toContain('00:00:01.000 --> 00:00:02.000')
  })
})
