import {
    SET_FLAG,
    SET_SHOW_NOT_FOUNT,
    SET_CURRENT_DRAG_COMPONENT,
    SET_COMPONENT_LIST,
    DEL_COMPONENT_LIST,
    PUT_COMPONENT_LIST,
    INSERT_COMPONENT_LIST
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
    action: { type: string, payload: any }) => {
    switch (action.type) {
        case SET_FLAG: // 控制插入位置标识显隐
            return { ...state, flag: action.payload }
        case SET_SHOW_NOT_FOUNT: // 设置默认notFound界面的显隐
            return { ...state, showNotFound: action.payload }
        case SET_CURRENT_DRAG_COMPONENT: // 设置当前拖拽的组件
            return {
                ...state, currentDragComponent: {
                    ...state.currentDragComponent,
                    ...action.payload
                }
            }
        case SET_COMPONENT_LIST:
            return { ...state, componentList: action.payload }
        case DEL_COMPONENT_LIST:
            const list = state.componentList;
            const { flag } = action.payload || {}
            for (let i = 0; i < list.length; i++) {
                if (list[i].componentKey === flag) {
                    list.splice(i, 1)
                    break
                }
            }
            return { ...state, componentList: list }
        case PUT_COMPONENT_LIST:
            const _list = JSON.parse(JSON.stringify(state.componentList)); // TODO deelpClone
            _list.push(action.payload)
            console.log('_list', _list)
            return { ...state, componentList: _list }
        case INSERT_COMPONENT_LIST:
            const _componentList = state.componentList;
            const { componentKey, data } = action.payload || {}
            for (let i = 0; i < _componentList.length; i++) {
                if (_componentList[i].componentKey === componentKey) {
                    _componentList.splice(i, 0, data)
                    break
                }
            }
            return { ...state, componentList: _componentList }
        default:
            return { ...state }
    }
}
