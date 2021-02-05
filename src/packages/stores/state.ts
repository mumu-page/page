import { FormComProp } from "./typings";
import { LOCAL_STORE_KEY } from "../constants";

// 用于存储拖拽时当前拖拽的数据(无响应式)
function initGlobalState(): { currentDragComponent: FormComProp; } {
    const local = window.localStorage.getItem(LOCAL_STORE_KEY) || ''
    const ret = {
        currentDragComponent: {
            id: '',
            componentKey: "",
            formItemProps: {},
            componentProps: {},
        }
    } as { currentDragComponent: FormComProp; }
    try {
        const globalState = JSON.parse(local) || {}
        ret.currentDragComponent = globalState?.currentDragComponent
    } catch (error) {
        return ret
    }
    return ret
}
export const GLOBAL_STATE: { currentDragComponent: FormComProp; } = initGlobalState();