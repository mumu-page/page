import { useContext, useReducer, useEffect } from 'react'
import { cloneDeep } from 'lodash'
import { Context } from './context'
import { IndexedDB } from '@r-generator/shared'
import { commonReducer } from './reducers'
import { SET_GLOBAL } from './actionTypes'
import { shortid } from '../../shared'

export function useStore() {
  return useContext(Context)
}

const indexedDB = new IndexedDB()
const CURRENT_ID = 'CURRENT_ID'
let isInit = true

/**
 * 包装reducer，新增本地持久化能力
 * @param reducer 原始reducer
 * @param initialState 默认值
 */
export function useLPReducer(reducer: typeof commonReducer, initialState: any) {
  const [commonState, dispatch] = useReducer(reducer, initialState)
  const { setGlobal, ...state } = commonState
  const stateBackup: any = cloneDeep(state)
  // console.log('useLPReducer called')
  // console.log(stateBackup)

  const init = () => {
    // console.log('init')
    indexedDB
      .readAll()
      .then((res) => {
        const id = window.localStorage.getItem(CURRENT_ID)
        res.forEach((item) => {
          if (id === item.id) {
            // console.log(item)
            dispatch({ type: SET_GLOBAL, payload: item })
            return
          }
        })
      })
      .finally(() => {
        isInit = false
      })
  }

  useEffect(() => {
    if (isInit) return
    const id = shortid()
    // console.log('useEffect stateBackup')
    stateBackup.id = id
    indexedDB.add(stateBackup, id)
    window.localStorage.setItem(CURRENT_ID, id)
  }, [JSON.stringify(stateBackup)])

  useEffect(() => {
    init()
  }, [])

  return { commonState, dispatch }
}
