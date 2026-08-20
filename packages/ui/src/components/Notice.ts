import type { NoticePosition, UIInterface } from '../types'

const NOTICE_HIDE_DELAY = 2000

const render = (it: UIInterface) => {
  const { player } = it

  function show(text: string, pos?: NoticePosition, id?: string) {
    it.toast({
      id,
      text,
      position: pos || 'left',
      duration: NOTICE_HIDE_DELAY
    })
  }

  player.on('notice', ({ payload }) => show(payload.text, payload.pos, payload.id))

  it.notice = show

  return show
}

export default render
