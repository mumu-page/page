import { ICommonState } from '../types'
import produce from 'immer'
import target from './target'
import components from './components'
import mode from './mode'
import type from './type'
import { SET_GLOBAL } from '../actionTypes'

/**
 * 公共
 * @param state
 * @param action
 */
export const commonReducer = produce(
  (draft: ICommonState, action: { type: string; payload?: any }) => {
    const strategy: { [key: string]: () => void } = {
      ...target(draft, action),
      ...components(draft, action),
      ...mode(draft, action),
      ...type(draft, action),
      [SET_GLOBAL]: () => {
        Object.keys(draft).forEach((key) => {
          draft[key] = action.payload?.[key]
        })
      },
    }
    if (typeof strategy[action.type] === 'function') {
      // console.table({
      //   [action.type]: strategy[action.type](),
      //   payload: action.payload,
      // });
      strategy[action.type]()
    }
  }
)
