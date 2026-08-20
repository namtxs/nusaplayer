import { Highlight, themes } from 'prism-react-renderer'
import { useRef, type KeyboardEvent } from 'react'
import style from './playground.module.scss'

export function CodeEditor({
  value,
  onChange,
  onRun
}: {
  value: string
  onChange: (next: string) => void
  onRun: () => void
}) {
  const preRef = useRef<HTMLPreElement>(null)

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault()
      const el = event.currentTarget
      const start = el.selectionStart
      const end = el.selectionEnd
      const next = value.slice(0, start) + '  ' + value.slice(end)
      onChange(next)
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2
      })
    }
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault()
      onRun()
    }
  }

  return (
    <div className={style.editorWrap}>
      <Highlight theme={themes.vsDark} code={value.endsWith('\n') ? value : value + '\n'} language="tsx">
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre ref={preRef} className={style.highlight} aria-hidden>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, j) => (
                  <span key={j} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
      <textarea
        className={style.editor}
        spellCheck={false}
        value={value}
        aria-label="Playground source"
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        onScroll={(event) => {
          const pre = preRef.current
          if (!pre) return
          pre.scrollTop = event.currentTarget.scrollTop
          pre.scrollLeft = event.currentTarget.scrollLeft
        }}
      />
    </div>
  )
}
