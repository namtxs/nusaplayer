import { describe, expect, it } from 'vitest'
import { css } from '../src/utils/css'

describe('css @global', () => {
  it('splits comma-separated @global selectors into valid rules', () => {
    const rules = css(
      {
        ['@global .full &, @global .web &']: { padding: '1em' }
      },
      '.root'
    )

    expect(rules.join('\n')).not.toContain('@global')
    expect(rules).toEqual(expect.arrayContaining(['.full .root{padding:1em}', '.web .root{padding:1em}']))
  })
})
