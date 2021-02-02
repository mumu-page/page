import { FormComProp } from "../stores/typings";
import { guid } from "../utils/utils";
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
