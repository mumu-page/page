import {
  SET_CURRENT_DRAG_COMPONENT,
  SET_COMPONENT_LIST,
  DEL_COMPONENT_LIST,
  PUT_COMPONENT_LIST,
  INSERT_COMPONENT_LIST,
  UPDATE_COMPONENT_LIST,
  UPDATE_COMPONENT_LIST_CHOSEN,
} from "./action-type";
import { CommonState, FlagState, NotFoundState } from "./typings";
import { merge } from "lodash";

/**
 * 公共
 * @param state
 * @param action
 */
export const commonReducer = (
  state: CommonState & FlagState & NotFoundState,
  action: { type: string; payload: any }
) => {
  let componentList = []
  switch (action.type) {
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
      componentList = JSON.parse(JSON.stringify(state.componentList));
      const { componentKey } = action.payload || {};
      for (let i = 0; i < componentList.length; i++) {
        if (componentList[i].componentKey === componentKey) {
          componentList.splice(i, 1);
          break;
        }
      }
      return { ...state, componentList: componentList };
    case PUT_COMPONENT_LIST:
      componentList = JSON.parse(JSON.stringify(state.componentList)); // TODO deelpClone
      componentList.push(action.payload);
      return { ...state, componentList: componentList };
    case INSERT_COMPONENT_LIST:
      componentList = JSON.parse(JSON.stringify(state.componentList));
      const { index, data } = action.payload;
      componentList.splice(index, 0, data);
      return { ...state, componentList: componentList };
    case UPDATE_COMPONENT_LIST:
      componentList = JSON.parse(JSON.stringify(state.componentList));
      const { id, data: data2 = {} } =
        action.payload || {};
      for (let i = 0; i < componentList.length; i++) {
        if (componentList[i].id === id) {
          componentList[i] = merge(componentList[i], data2);
          break;
        }
      }
      return { ...state, componentList: componentList };
    case UPDATE_COMPONENT_LIST_CHOSEN:
      componentList = JSON.parse(JSON.stringify(state.componentList));
      const { id: id2 } =
        action.payload || {};
      for (let i = 0; i < componentList.length; i++) {
        if (componentList[i].id === id2) {
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
    default:
      return { ...state };
  }
};
