export type VastTracking = {
  impression: string[]
  start: string[]
  firstQuartile: string[]
  midpoint: string[]
  thirdQuartile: string[]
  complete: string[]
  skip: string[]
  click: string[]
}

export type VastCreative = {
  mediaUrl: string
  mimeType?: string
  duration: number
  skipOffset?: number
  clickThrough?: string
  tracking: VastTracking
}

const emptyTracking = (): VastTracking => ({
  impression: [],
  start: [],
  firstQuartile: [],
  midpoint: [],
  thirdQuartile: [],
  complete: [],
  skip: [],
  click: []
})

function els(root: Document | Element, name: string): Element[] {
  return Array.from(root.getElementsByTagName(name))
}

function text(el?: Element | null) {
  return el?.textContent?.trim() ?? ''
}

function mergeTracking(into: VastTracking, extra: VastTracking) {
  ;(Object.keys(into) as (keyof VastTracking)[]).forEach((key) => {
    into[key].push(...extra[key])
  })
}

/** `HH:MM:SS[.mmm]`, `MM:SS`, seconds, or `12%` of `total`. */
export function parseVastTime(value?: string | null, total?: number) {
  if (!value) return
  const raw = value.trim()
  if (raw.endsWith('%') && total != null) {
    const pct = Number(raw.slice(0, -1))
    if (Number.isFinite(pct)) return Math.floor((total * pct) / 100)
    return
  }
  if (raw.includes(':')) {
    const parts = raw.split(':').map(Number)
    if (parts.some((n) => !Number.isFinite(n))) return
    if (parts.length === 3) return Math.floor(parts[0]! * 3600 + parts[1]! * 60 + parts[2]!)
    if (parts.length === 2) return Math.floor(parts[0]! * 60 + parts[1]!)
  }
  const asNumber = Number(raw)
  return Number.isFinite(asNumber) ? Math.floor(asNumber) : undefined
}

function collectTracking(root: Element): VastTracking {
  const tracking = emptyTracking()
  els(root, 'Impression').forEach((el) => {
    const url = text(el)
    if (url) tracking.impression.push(url)
  })
  els(root, 'Tracking').forEach((el) => {
    const event = el.getAttribute('event')
    const url = text(el)
    if (!url || !event) return
    if (event in tracking) tracking[event as keyof VastTracking].push(url)
  })
  els(root, 'ClickTracking').forEach((el) => {
    const url = text(el)
    if (url) tracking.click.push(url)
  })
  return tracking
}

function pickMedia(linear: Element) {
  const files = els(linear, 'MediaFile')
    .map((el) => ({
      url: text(el),
      type: (el.getAttribute('type') || '').toLowerCase(),
      delivery: (el.getAttribute('delivery') || '').toLowerCase(),
      width: Number(el.getAttribute('width')) || 0
    }))
    .filter((file) => file.url)

  files.sort((a, b) => {
    const rank = (file: (typeof files)[number]) => {
      let score = file.width
      if (file.type.includes('mp4')) score += 10_000
      else if (file.type.includes('webm')) score += 8_000
      else if (file.type.includes('mpegurl') || file.type.includes('m3u8')) score += 4_000
      if (file.delivery === 'progressive') score += 500
      return score
    }
    return rank(b) - rank(a)
  })

  return files[0]
}

function parseLinear(ad: Element, extra: VastTracking): VastCreative | undefined {
  const linear = els(ad, 'Linear')[0]
  if (!linear) return
  const media = pickMedia(linear)
  if (!media) return
  const duration = parseVastTime(text(els(linear, 'Duration')[0])) ?? 0
  const skipOffset = parseVastTime(linear.getAttribute('skipoffset'), duration)
  const tracking = extra
  mergeTracking(tracking, collectTracking(ad))
  return {
    mediaUrl: media.url,
    mimeType: media.type,
    duration,
    skipOffset,
    clickThrough: text(els(linear, 'ClickThrough')[0]) || undefined,
    tracking
  }
}

export function parseVast(xml: string, extra = emptyTracking()): VastCreative | undefined {
  const doc = new DOMParser().parseFromString(xml, 'text/xml')
  if (doc.querySelector('parsererror')) return
  const ad = els(doc, 'Ad')[0]
  if (!ad) return
  if (els(ad, 'InLine')[0]) return parseLinear(ad, extra)
  return undefined
}

function wrapperUri(xml: string) {
  const doc = new DOMParser().parseFromString(xml, 'text/xml')
  if (doc.querySelector('parsererror')) return
  const ad = els(doc, 'Ad')[0]
  if (!ad || !els(ad, 'Wrapper')[0]) return
  const uri = text(els(ad, 'VASTAdTagURI')[0])
  if (!uri) return
  return { uri, tracking: collectTracking(ad) }
}

export async function loadVast(tag: string, depth = 0): Promise<VastCreative> {
  if (depth > 5) throw new Error('VAST wrapper limit')
  const res = await fetch(tag, { credentials: 'omit' })
  if (!res.ok) throw new Error(`VAST HTTP ${res.status}`)
  const xml = await res.text()
  const inline = parseVast(xml)
  if (inline) return inline
  const wrapped = wrapperUri(xml)
  if (!wrapped) throw new Error('No VAST Linear creative')
  const next = await loadVast(wrapped.uri, depth + 1)
  mergeTracking(next.tracking, wrapped.tracking)
  return next
}

export function fireVastUrls(urls?: string[]) {
  urls?.forEach((url) => {
    if (!url) return
    try {
      if (typeof navigator !== 'undefined' && navigator.sendBeacon?.(url)) return
      const img = new Image()
      img.src = url
    } catch {
      /* ignore beacon failures */
    }
  })
}
