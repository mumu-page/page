import { useReducer, useEffect } from 'react'

/**
 * store数据持久化hook
 * @param reducer
 * @param defaultState
 * @param storageKey
 * @param init
 */
export function useLocallyPersistedReducer(
  reducer: any,
  defaultState: any,
  storageKey: string,
  init?: any
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

  const state = hookVars[0]

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(hookVars[0]))
  }, [storageKey, hookVars, state])

  return hookVars
}
