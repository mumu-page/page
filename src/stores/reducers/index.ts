import { ICommonState } from '../typings'
import produce from 'immer'
import target from './target'
import components from './components'

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
