import { FormComProp } from "../stores/typings";
import { LOCAL_STORE_KEY } from "../constants";

function initGlobalState(): {currentDragComponent: FormComProp;} {
  const local = window.localStorage.getItem(LOCAL_STORE_KEY) || ''
  const ret = {
    currentDragComponent: {
      id: '',
      componentKey: "",
      formItemProps: {},
      componentProps: {},
    }
  } as {currentDragComponent: FormComProp;}
  try {
    const globalState = JSON.parse(local) || {}
    ret.currentDragComponent = globalState?.currentDragComponent
  } catch (error) {
    return ret
  }
  return ret
}
export const globalState: {currentDragComponent: FormComProp;} = initGlobalState();
