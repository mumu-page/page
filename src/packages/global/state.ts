import { FormComProp } from "../stores/typings";
import { guid } from "../utils";
export const globalState: {
  currentDragComponent: FormComProp;
} = {
  currentDragComponent: {
    id: guid(),
    componentKey: "",
    formItemProps: {},
    componentProps: {},
  },
};
