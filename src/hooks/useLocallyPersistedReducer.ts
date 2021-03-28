import { cloneDeep } from "lodash";
import { useReducer, useEffect } from "react";

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
  init?: any,
  excludeKeys = ["moveableOptions"]
) {
  const hookVars = useReducer(reducer, defaultState, (defaultState) => {
    let persisted;
    try {
      const local = localStorage.getItem(storageKey);
      if (typeof local === "string") {
        persisted = JSON.parse(local);
      }
    } catch (e) {}
    return typeof persisted !== "undefined"
      ? persisted
      : typeof init !== "undefined"
      ? init(defaultState)
      : defaultState;
  });

  const state: any = cloneDeep(hookVars[0]);
  excludeKeys.forEach((key) => {
    delete state[key];;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [storageKey, hookVars, state]);

  return hookVars;
}
