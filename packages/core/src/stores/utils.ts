import { SET_MOVEABLE_OPTIONS } from './actionTypes'

// 重新获取当前选中元素
export function refreshTarget(
  target: unknown,
  commonDispatch: React.Dispatch<{
    type: string
    payload?: object | undefined
  }>
) {
  requestAnimationFrame(() => {
    commonDispatch({
      type: SET_MOVEABLE_OPTIONS,
      payload: {
        target: null, // immner会认为targer是同一个元素，导致不更新
      },
    })
    commonDispatch({
      type: SET_MOVEABLE_OPTIONS,
      payload: {
        target,
      },
    })
  })
}
