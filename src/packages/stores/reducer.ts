import {
  SET_CURRENT_DRAG_COMPONENT,
  SET_COMPONENT_LIST,
  DEL_COMPONENT_LIST,
  PUT_COMPONENT_LIST,
  INSERT_COMPONENT_LIST,
  UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
  UPDATE_COMPONENT_LIST_BY_CHOSEN,
} from "./action-type";
import { CommonState, FlagState, NotFoundState } from "./typings";
import { merge, cloneDeep } from "lodash";

/**
 * 公共
 * @param state
 * @param action
 */
export const commonReducer = (
  state: CommonState & FlagState & NotFoundState,
  action: { type: string; payload: any }
) => {
  const strategy: { [key: string]: () => CommonState & FlagState & NotFoundState } = {
    [SET_CURRENT_DRAG_COMPONENT]: () => {
      return {
        ...state,
        currentDragComponent: cloneDeep(merge(state.currentDragComponent, action.payload)),
      };
    },
    [SET_COMPONENT_LIST]: () => {
      return { ...state, componentList: action.payload };
    },
    [DEL_COMPONENT_LIST]: () => {
      const componentList = cloneDeep(state.componentList);
      for (let i = 0; i < componentList.length; i++) {
        if (componentList[i].id === action.payload?.id) {
          componentList.splice(i, 1);
          break;
        }
      }
      return { ...state, componentList: componentList };
    },
    [PUT_COMPONENT_LIST]: () => {
      const componentList = cloneDeep(state.componentList);
      for (let i = 0; i < componentList.length; i++) {
        componentList[i].chosen = false
      }
      componentList.push(action.payload);
      return { ...state, componentList: componentList };
    },
    [INSERT_COMPONENT_LIST]: () => {
      const { index, data } = action.payload;
      const componentList = cloneDeep(state.componentList);
      componentList.splice(index, 0, data);
      return { ...state, componentList: componentList };
    },
    [UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG]: () => {
      const componentList = cloneDeep(state.componentList);
      const { data = {} } = action.payload || {};
      for (let i = 0; i < componentList.length; i++) {
        if (componentList[i].id === state.currentDragComponent?.id) {
          componentList[i] = merge(componentList[i], data);
          break;
        }
      }
      return { ...state, componentList };
    },
    [UPDATE_COMPONENT_LIST_BY_CHOSEN]: () => {
      const componentList = cloneDeep(state.componentList);
      const { id } = action.payload || {};
      if (!id) return state
      for (let i = 0; i < componentList.length; i++) {
        if (componentList[i].id === id) {
          componentList[i] = {
            ...(componentList[i] || {}),
            chosen: true,
          };
        } else {
          componentList[i] = {
            ...(componentList[i] || {}),
            chosen: false,
          };
        }
      }
      return { ...state, componentList: componentList };
    }
  }

  if (typeof strategy[action.type] === 'function') {
    return strategy[action.type]()
  } else {
    return { ...state };
  }
};
