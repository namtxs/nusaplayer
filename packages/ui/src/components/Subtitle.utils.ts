export function fixSrt(srt: string) {
  return srt.replace(/(\d\d:\d\d:\d\d)[,.](\d+)/g, (_, $1, $2) => {
    let ms = $2.slice(0, 3)
    if ($2.length === 1) {
      ms = $2 + '00'
    }
    if ($2.length === 2) {
      ms = $2 + '0'
    }
    return `${$1},${ms}`
  })
}

export function srtToVtt(srtText: string) {
  return 'WEBVTT \r\n\r\n'.concat(
    fixSrt(srtText)
      .replace(/\{\\([ibu])\}/g, '</$1>')
      .replace(/\{\\([ibu])1\}/g, '<$1>')
      .replace(/\{([ibu])\}/g, '<$1>')
      .replace(/\{\/([ibu])\}/g, '</$1>')
      .replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2')
      .replace(/{[\s\S]*?}/g, '')
      .concat('\r\n\r\n')
  )
}

export function vttToBlob(vttText: string) {
  return URL.createObjectURL(
    new Blob([vttText], {
      type: 'text/vtt'
    })
  )
}

type AssDraw = {
  b: boolean
  i: boolean
  u: boolean
  s: boolean
  color?: string
  drawing: boolean
}

type AssStyle = AssDraw & { alignment: number }

const AN_SETTINGS: Record<number, string> = {
  1: 'align:start position:10% line:90%',
  2: 'align:center position:50% line:90%',
  3: 'align:end position:90% line:90%',
  4: 'align:start position:10% line:50%',
  5: 'align:center position:50% line:50%',
  6: 'align:end position:90% line:50%',
  7: 'align:start position:10% line:10%',
  8: 'align:center position:50% line:10%',
  9: 'align:end position:90% line:10%'
}

const reAss = new RegExp(
  'Dialogue:\\s\\d+,' +
    '(\\d+:\\d\\d:\\d\\d\\.\\d\\d),' +
    '(\\d+:\\d\\d:\\d\\d\\.\\d\\d),' +
    '([^,]*),' +
    '([^,]*),' +
    '(?:[^,]*,){4}' +
    '(.*)$',
  'i'
)

export function assColorToRgb(value: string): string | undefined {
  const m = /&H([0-9A-Fa-f]{6,8})/i.exec(value)
  if (!m) return
  const hexRaw = m[1]
  if (!hexRaw) return
  let hex = hexRaw.toUpperCase()
  if (hex.length === 6) hex = `00${hex}`
  return `${hex.slice(6, 8)}${hex.slice(4, 6)}${hex.slice(2, 4)}`
}

export function assTimeToVtt(value: string) {
  const [hours, minutes, rest] = value.split(':')
  const [seconds, centis = '00'] = (rest || '00.00').split('.')
  return `${(hours || '0').padStart(2, '0')}:${minutes}:${seconds}.${centis.padEnd(3, '0').slice(0, 3)}`
}

function flag(value: string | undefined) {
  return value === '-1' || value === '1'
}

function parseAssStyles(ass: string) {
  const styles = new Map<string, AssStyle>()
  for (const line of ass.split(/\r?\n/)) {
    if (!/^Style:/i.test(line)) continue
    const parts = line.replace(/^Style:\s*/i, '').split(',')
    if (parts.length < 19) continue
    const name = parts[0]!.trim()
    styles.set(name, {
      b: flag(parts[7]),
      i: flag(parts[8]),
      u: flag(parts[9]),
      s: flag(parts[10]),
      color: assColorToRgb(parts[3] || ''),
      drawing: false,
      alignment: Number(parts[18]) || 2
    })
  }
  return styles
}

function openMarkup(draw: AssDraw) {
  if (draw.drawing) return ''
  let out = ''
  if (draw.color) out += `<c.color${draw.color}>`
  if (draw.b) out += '<b>'
  if (draw.i) out += '<i>'
  if (draw.u) out += '<u>'
  return out
}

function closeMarkup(draw: AssDraw) {
  if (draw.drawing) return ''
  let out = ''
  if (draw.u) out += '</u>'
  if (draw.i) out += '</i>'
  if (draw.b) out += '</b>'
  if (draw.color) out += '</c>'
  return out
}

function sameDraw(a: AssDraw, b: AssDraw) {
  return a.b === b.b && a.i === b.i && a.u === b.u && a.s === b.s && a.color === b.color && a.drawing === b.drawing
}

function applyAssTags(block: string, state: AssDraw, fallback: AssDraw) {
  let alignment: number | undefined
  for (const raw of block.split('\\').slice(1)) {
    const tag = raw.trim()
    if (!tag) continue
    if (/^p\d/i.test(tag)) {
      state.drawing = !/^p0/i.test(tag)
      continue
    }
    if (/^an\d/i.test(tag)) {
      alignment = Number(tag.slice(2))
      continue
    }
    if (/^a\d/i.test(tag) && !/^an/i.test(tag)) {
      alignment = Number(tag.slice(1))
      continue
    }
    if (/^i0/i.test(tag)) state.i = false
    else if (/^i/i.test(tag)) state.i = true
    else if (/^b0/i.test(tag)) state.b = false
    else if (/^b/i.test(tag)) state.b = true
    else if (/^u0/i.test(tag)) state.u = false
    else if (/^u/i.test(tag)) state.u = true
    else if (/^s0/i.test(tag)) state.s = false
    else if (/^s/i.test(tag)) state.s = true
    else if (/^(?:1)?c&H/i.test(tag)) state.color = assColorToRgb(tag)
    else if (/^r/i.test(tag)) {
      state.b = fallback.b
      state.i = fallback.i
      state.u = fallback.u
      state.s = fallback.s
      state.color = fallback.color
      state.drawing = false
    }
  }
  return alignment
}

function convertAssText(text: string, initial: AssDraw) {
  const fallback: AssDraw = { ...initial, drawing: false }
  const state: AssDraw = { ...fallback }
  let alignment: number | undefined
  let out = openMarkup(state)

  for (const part of text.split(/(\{[^}]*\})/)) {
    if (!part) continue
    if (part.startsWith('{') && part.endsWith('}')) {
      const prev = { ...state }
      const nextAlign = applyAssTags(part.slice(1, -1), state, fallback)
      if (nextAlign) alignment = nextAlign
      if (!sameDraw(prev, state)) out += closeMarkup(prev) + openMarkup(state)
      continue
    }
    if (state.drawing) continue
    out += escape(part)
      .replace(/\\N/g, '\n')
      .replace(/\\n/g, ' ')
      .replace(/\\h/g, '\u00A0')
  }

  out += closeMarkup(state)
  return { text: out, alignment }
}

/** Convert ASS/SSA dialogue lines to WebVTT, keeping bold/italic/color and \an alignment. */
export function assToVtt(ass: string) {
  const styles = parseAssStyles(ass)
  const fallback: AssStyle = {
    b: false,
    i: false,
    u: false,
    s: false,
    drawing: false,
    alignment: 2
  }

  return `WEBVTT\r\n\r\n${ass
    .split(/\r?\n/)
    .map((line) => {
      const m = line.match(reAss)
      if (!m || !m[1] || !m[2] || !m[5]) return null

      const style = styles.get((m[3] || '').trim()) || fallback
      const converted = convertAssText(m[5], style)
      const alignment = converted.alignment || style.alignment
      const settings = AN_SETTINGS[alignment] ?? 'align:center position:50% line:90%'
      const voice = (m[4] || '').trim()
      const body = voice ? `<v ${escape(voice)}>${converted.text}</v>` : converted.text

      return {
        start: assTimeToVtt(m[1]),
        end: assTimeToVtt(m[2]),
        settings,
        text: body
      }
    })
    .filter((line) => line != null)
    .map(
      (line, i) =>
        `${i + 1}\r\n${line!.start} --> ${line!.end} ${line!.settings}\r\n${line!.text}`
    )
    .join('\r\n\r\n')}`
}

export function applyVttColors(root: ParentNode) {
  root.querySelectorAll('[class]').forEach((node) => {
    const el = node as HTMLElement
    for (const name of el.classList) {
      const hex = /^color([0-9A-Fa-f]{6})$/.exec(name)
      if (hex) el.style.color = `#${hex[1]}`
    }
  })
}

export function layoutVttCue(box: HTMLElement, cue: VTTCue) {
  box.style.position = 'absolute'
  box.style.left = '0'
  box.style.right = '0'
  box.style.width = '100%'
  box.style.margin = '0'

  const align = cue.align
  box.style.textAlign =
    align === 'start' || align === 'left' ? 'left' : align === 'end' || align === 'right' ? 'right' : 'center'

  if (cue.line === 'auto') {
    box.dataset.npCueAuto = ''
    box.style.top = 'auto'
    box.style.bottom = ''
    box.style.transform = ''
    return
  }

  delete box.dataset.npCueAuto
  const line = typeof cue.line === 'number' ? cue.line : Number(cue.line)
  if (!Number.isFinite(line)) {
    box.dataset.npCueAuto = ''
    box.style.bottom = ''
    box.style.top = 'auto'
    box.style.transform = ''
    return
  }

  if (cue.snapToLines) {
    box.style.transform = ''
    if (line < 0) {
      box.style.bottom = `${-line * 1.4}em`
      box.style.top = 'auto'
    } else {
      box.style.top = `${line * 1.4}em`
      box.style.bottom = 'auto'
    }
    return
  }

  if (line <= 20) {
    box.style.top = `${line}%`
    box.style.bottom = 'auto'
    box.style.transform = ''
  } else if (line >= 80) {
    box.style.bottom = `${100 - line}%`
    box.style.top = 'auto'
    box.style.transform = ''
  } else {
    box.style.top = `${line}%`
    box.style.bottom = 'auto'
    box.style.transform = 'translateY(-50%)'
  }
}

export function escape(str: string) {
  return str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
  )
}
