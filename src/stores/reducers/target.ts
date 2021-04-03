import { cloneDeep, merge } from 'lodash'
import { DELETE_TARGET, SET_MOVEABLE_OPTIONS, SET_TARGET } from '../action-type'
import { INITAL_STATE } from '../context'
import { ICommonState } from '../typings'

export default (
  draft: ICommonState,
  action: { type: string; payload?: any }
) => ({
  [SET_TARGET]: () => {
    draft.target = merge(cloneDeep(draft.target), cloneDeep(action.payload))
  },
  [DELETE_TARGET]: () => {
    draft.target = INITAL_STATE.target
  },
  [SET_MOVEABLE_OPTIONS]: () => {
    draft.moveableOptions = merge(
      draft.moveableOptions,
      cloneDeep(action.payload)
    )
  },
})
