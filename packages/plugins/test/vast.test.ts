import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadVast, parseVast, parseVastTime } from '../src/vast/parse'

const inlineVast = `<?xml version="1.0" encoding="UTF-8"?>
<VAST version="3.0">
  <Ad>
    <InLine>
      <Impression><![CDATA[https://example.com/imp]]></Impression>
      <Creatives>
        <Creative>
          <Linear skipoffset="00:00:05">
            <Duration>00:00:15</Duration>
            <TrackingEvents>
              <Tracking event="start"><![CDATA[https://example.com/start]]></Tracking>
              <Tracking event="complete"><![CDATA[https://example.com/complete]]></Tracking>
            </TrackingEvents>
            <VideoClicks>
              <ClickThrough><![CDATA[https://example.com/click]]></ClickThrough>
              <ClickTracking><![CDATA[https://example.com/click-track]]></ClickTracking>
            </VideoClicks>
            <MediaFiles>
              <MediaFile delivery="streaming" type="application/x-mpegURL" width="1920">https://example.com/ad.m3u8</MediaFile>
              <MediaFile delivery="progressive" type="video/mp4" width="640">https://example.com/ad.mp4</MediaFile>
            </MediaFiles>
          </Linear>
        </Creative>
      </Creatives>
    </InLine>
  </Ad>
</VAST>`

const wrapperVast = `<?xml version="1.0" encoding="UTF-8"?>
<VAST version="3.0">
  <Ad>
    <Wrapper>
      <VASTAdTagURI><![CDATA[https://example.com/inline.xml]]></VASTAdTagURI>
      <Impression><![CDATA[https://example.com/wrap-imp]]></Impression>
    </Wrapper>
  </Ad>
</VAST>`

describe('parseVastTime', () => {
  it('parses clock times', () => {
    expect(parseVastTime('00:01:30')).toBe(90)
    expect(parseVastTime('1:02')).toBe(62)
    expect(parseVastTime('00:00:05.9')).toBe(5)
  })

  it('parses seconds and percent of duration', () => {
    expect(parseVastTime('45')).toBe(45)
    expect(parseVastTime('12%', 100)).toBe(12)
    expect(parseVastTime('')).toBeUndefined()
    expect(parseVastTime('nope')).toBeUndefined()
  })
})

describe('parseVast', () => {
  it('reads a Linear InLine creative and prefers mp4', () => {
    const creative = parseVast(inlineVast)
    expect(creative).toMatchObject({
      mediaUrl: 'https://example.com/ad.mp4',
      mimeType: 'video/mp4',
      duration: 15,
      skipOffset: 5,
      clickThrough: 'https://example.com/click'
    })
    expect(creative?.tracking.impression).toEqual(['https://example.com/imp'])
    expect(creative?.tracking.start).toEqual(['https://example.com/start'])
    expect(creative?.tracking.complete).toEqual(['https://example.com/complete'])
    expect(creative?.tracking.click).toEqual(['https://example.com/click-track'])
  })

  it('returns undefined for invalid or wrapper-only XML', () => {
    expect(parseVast('<not-xml')).toBeUndefined()
    expect(parseVast(wrapperVast)).toBeUndefined()
  })
})

describe('loadVast', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('follows a Wrapper and merges impressions', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        const body = String(url).includes('inline') ? inlineVast : wrapperVast
        return { ok: true, status: 200, text: async () => body }
      })
    )

    const creative = await loadVast('https://example.com/wrap.xml')
    expect(creative.mediaUrl).toBe('https://example.com/ad.mp4')
    expect(creative.tracking.impression).toEqual([
      'https://example.com/imp',
      'https://example.com/wrap-imp'
    ])
  })

  it('stops after too many wrappers', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, status: 200, text: async () => wrapperVast }))
    )
    await expect(loadVast('https://example.com/wrap.xml')).rejects.toThrow('VAST wrapper limit')
  })
})
