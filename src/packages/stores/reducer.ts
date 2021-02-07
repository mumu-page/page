import {
  SET_CURRENT_DRAG_COMPONENT,
  SET_COMPONENT_LIST,
  DEL_COMPONENT_LIST,
  PUT_COMPONENT_LIST,
  INSERT_COMPONENT_LIST,
  UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
  UPDATE_COMPONENT_LIST_AND_CURRENT_DRAG,
  SET_CURRENT_DRAG_COMPONENT_BY_COMPONENT_LIST,
  DELETE_ALL_COMPONENT_LIST_AND_CURRENT_DRAG,
} from "./action-type";
import { CommonState } from './typings'
import { merge, cloneDeep } from 'lodash'

/**
 * 公共
 * @param state
 * @param action
 */
export const commonReducer = (
  state: CommonState,
  action: { type: string; payload?: any }
) => {
  const strategy: { [key: string]: () => CommonState } = {
    [SET_CURRENT_DRAG_COMPONENT]: () => {
      return {
        ...state,
        currentDragComponent: merge(
          cloneDeep(state.currentDragComponent),
          action.payload
        ),
      };
    },
    [SET_CURRENT_DRAG_COMPONENT_BY_COMPONENT_LIST]: () => {
      let currentDragComponent = {} as any;
      state.componentList.forEach((item) => {
        if (item?.id === action.payload?.id) {
          currentDragComponent = cloneDeep(item);
        }
      });
      return {
        ...state,
        currentDragComponent,
      } as any;
    },
    // 清空控件列表和当前拖拽控件数据
    [DELETE_ALL_COMPONENT_LIST_AND_CURRENT_DRAG]: () => {
      return {
        ...state,
        componentList: [],
        currentDragComponent: {
          id: "",
          componentKey: "",
          formItemProps: {},
          componentProps: {},
        },
      };
    },
    /* 设置组件列表，并根据当前选中的组件，设置其他组件为未选中 */
    [SET_COMPONENT_LIST]: () => {
      const componentList = action.payload?.newState?.map(
        (item: { id: any; chosen: boolean }) => {
          if (
            item?.id ===
            (action.payload?.currentId || state.currentDragComponent?.id)
          ) {
            item.chosen = true;
          } else {
            item.chosen = false;
          }
          return item;
        }
      );
      return { ...state, componentList };
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
      const componentList = state?.componentList?.map((item) => {
        item.chosen = false;
        return item;
      });
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
      const { data = {} } = action.payload || {};
      const componentList = state?.componentList?.map((item) => {
        if (item.id === state.currentDragComponent?.id) {
          item = merge(cloneDeep(item), data);
        }
        return item;
      });
      return { ...state, componentList };
    },
    // 同时更新当前选中控件和设计区控件列表
    [UPDATE_COMPONENT_LIST_AND_CURRENT_DRAG]: () => {
      const { componentKey, newComponentProps } = action.payload || {};
      const componentList = state?.componentList?.map((item) => {
        if (item.id === state.currentDragComponent?.id) {
          item.componentKey = componentKey;
          item.componentProps = {
            ...item.componentProps,
            ...newComponentProps,
          };
        }
        return item;
      });
      return {
        ...state,
        currentDragComponent: {
          ...state.currentDragComponent,
          componentKey,
          componentProps: newComponentProps,
        },
        componentList,
      };
    },
  };

  if (typeof strategy[action.type] === 'function') {
    console.table({
      [action.type]: strategy[action.type](),
      payload: action.payload,
    });
    return strategy[action.type]()
  } else {
    return { ...state }
  }
}
