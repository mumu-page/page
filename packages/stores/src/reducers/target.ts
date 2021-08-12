import { cloneDeep, merge } from 'lodash'
import {
  DELETE_TARGET,
  SET_MOVEABLE_OPTIONS,
  SET_TARGET,
  SET_TARGET_BY_COMPONENT_LIST,
} from '../actionTypes'
import { INITAL_STATE } from '../state'
import { ICommonState, PoolItem } from '../types'
import { coverValue } from './utils'

export default (
  draft: ICommonState,
  action: { type: string; payload?: any }
) => ({
  [DELETE_TARGET]: () => {
    draft.target = INITAL_STATE.target
  },
  [SET_TARGET_BY_COMPONENT_LIST]: () => {
    const findSelectedItem = (data: PoolItem[]) => {
      for (var i = 0; i < data.length; i++) {
        const item = data[i]
        if (item?.children?.length) {
          findSelectedItem(item?.children)
        }
        if (item?.id === action.payload?.id) {
          // item.rowProps = draft.target?.rowProps
          // item.formProps = draft.target?.formProps
          draft.target = item
          break
        }
      }
    }
    findSelectedItem(draft.componentList)
  },
  [SET_TARGET]: () => {
    const newData = merge(cloneDeep(draft.target), cloneDeep(action.payload))
    draft.target = newData
  },
  [DELETE_TARGET]: () => {
    Object.keys(draft.target).forEach((key) => {
      if (!['rowProps', 'formProps'].includes(key)) {
        // draft.target[key] = null
      }
    })
    // draft.target.id = 'null'
    // draft.target.componentKey = ''
  },
  [SET_MOVEABLE_OPTIONS]: () => {
    draft.moveableOptions = merge(
      draft.moveableOptions,
      cloneDeep(action.payload)
    )
  },
})
