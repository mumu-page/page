import {
  SET_FLAG,
  SET_SHOW_NOT_FOUNT,
  SET_CURRENT_DRAG_COMPONENT,
  SET_COMPONENT_LIST,
  DEL_COMPONENT_LIST,
  PUT_COMPONENT_LIST,
  INSERT_COMPONENT_LIST,
  UPDATE_COMPONENT_LIST,
  UPDATE_COMPONENT_LIST_CHOSEN,
} from "./action-type";
import { CommonState, FlagState, NotFoundState } from "./typings";
// import { deepClone } from "resonance-utils/utils/deepClone";

/**
 * 公共
 * @param state
 * @param action
 */
export const commonReducer = (
  state: CommonState & FlagState & NotFoundState,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case SET_FLAG: // 控制插入位置标识显隐
      return { ...state, flag: action.payload };
    case SET_SHOW_NOT_FOUNT: // 设置默认notFound界面的显隐
      return { ...state, showNotFound: action.payload };
    case SET_CURRENT_DRAG_COMPONENT: // 设置当前拖拽的组件
      return {
        ...state,
        currentDragComponent: {
          ...state.currentDragComponent,
          ...action.payload,
        },
      };
    case SET_COMPONENT_LIST:
      return { ...state, componentList: action.payload };
    case DEL_COMPONENT_LIST:
      const list = JSON.parse(JSON.stringify(state.componentList));
      const { componentKey } = action.payload || {};
      for (let i = 0; i < list.length; i++) {
        if (list[i].componentKey === componentKey) {
          list.splice(i, 1);
          break;
        }
      }
      return { ...state, componentList: list };
    case PUT_COMPONENT_LIST:
      const _list = JSON.parse(JSON.stringify(state.componentList)); // TODO deelpClone
      _list.push(action.payload);
      return { ...state, componentList: _list };
    case INSERT_COMPONENT_LIST:
      const _componentList = JSON.parse(JSON.stringify(state.componentList));
      const { index, data } = action.payload;
      _componentList.splice(index, 0, data);
      return { ...state, componentList: _componentList };
    case UPDATE_COMPONENT_LIST:
      const list2 = JSON.parse(JSON.stringify(state.componentList));
      const { id, data: data2 = {} } =
        action.payload || {};
      for (let i = 0; i < list2.length; i++) {
        if (list2[i].id === id) {
          list2[i] = {
            ...(list2[i] || {}),
            ...data2
          };
          break;
        }
      }
      return { ...state, componentList: list2 };
    case UPDATE_COMPONENT_LIST_CHOSEN:
      const list3= JSON.parse(JSON.stringify(state.componentList));
      const { id: id2 } =
        action.payload || {};
      for (let i = 0; i < list3.length; i++) {
        if (list3[i].id === id2) {
          list3[i] = {
            ...(list3[i] || {}),
            chosen: true,
          };
        } else {
          list3[i] = {
            ...(list3[i] || {}),
            chosen: false,
          };
        }
      }
      return { ...state, componentList: list3 };
    default:
      return { ...state };
  }
};
