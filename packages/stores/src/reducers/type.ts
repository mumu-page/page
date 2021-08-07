import { UPDATE_ACTION_TYPE } from '../actionTypes'
import { ICommonState } from '../types'

export default (
  draft: ICommonState,
  action: { type: string; payload?: any }
) => ({
  [UPDATE_ACTION_TYPE]: () => {
    draft.actionType = action.payload?.actionType
  },
})
