import { useContext, useReducer, useEffect } from 'react'
import { Context } from '../stores/context'
import { cloneDeep } from 'lodash'
import { ICommonState } from './types'

export function useStore() {
  const store = useContext(Context)
  return store
}

/**
 * 包装reducer，让它具有本地持久化能力
 * 
 * 利用了useReducer的第三个参数：初始化器
 * @param reducer 原始reducer
 * @param defaultState 默认值
 * @param storageKey 存储到本地的Key
 * @param init 初始化函数
 * @param excludeKeys 不需要持久化的属性
 */
export function useLPReducer(
  reducer: (...arg: any) => ICommonState,
  defaultState: any,
  storageKey: string,
  init?: any,
  excludeKeys = ['moveableOptions']
) {
  const hookVars = useReducer(reducer, defaultState, (defaultState) => {
    let persisted
    try {
      const local = localStorage.getItem(storageKey)
      if (typeof local === 'string') {
        persisted = JSON.parse(local)
      }
    } catch (e) {}
    return typeof persisted !== 'undefined'
      ? persisted
      : typeof init !== 'undefined'
      ? init(defaultState)
      : defaultState
  })

  const state: any = cloneDeep(hookVars[0])
  excludeKeys.forEach((key) => {
    delete state[key]
  })

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state))
  }, [storageKey, hookVars, state])

  return hookVars
}
