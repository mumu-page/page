import { UPDATE_MODE } from '../actionTypes'
import { ICommonState } from '../types'

export default (
  draft: ICommonState,
  action: { type: string; payload?: any }
) => ({
  [UPDATE_MODE]: () => {
    draft.mode = action.payload?.mode
  },
})
