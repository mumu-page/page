export interface commonDispatch<T = boolean> {
  commonDispatch: React.Dispatch<{
    type: string;
    payload?: T;
  }>;
}

export type ComponentKeys =
  | "Input"
  | "Input.TextArea"
  | "Input.Password"
  | "InputNumber"
  | "Editor"
  | "Select"
  | "Cascader"
  | "Radio"
  | "Checkbox"
  | "Switch"
  | "Slider"
  | "TimePicker"
  | "TimePicker.RangePicker"
  | "DatePicker"
  | "DatePicker.RangePicker"
  | "Rate"
  | "Upload"
  | "Col"
  | "Button"
  | "";

export interface FormComProp {
  componentKey: ComponentKeys; // 当前拖拽的控件key
  componentProps: { [key: string]: any }; // 当前拖拽的控件属性设置
  formProps?: { [key: string]: any }; // 当前Form属性设置
  formItemProps: { [key: string]: any }; // 当前FormItem属性设置
  colProps: { [key: string]: any }; // 当前Col属性设置
  rowProps?: { [key: string]: any }; // 当前Row属性设置
  layout?: { [key: string]: any }; //布局属性
  [key: string]: any;
  children?: FormComProp[];
}

export interface CommonState extends commonDispatch<object> {
  currentDragComponent: FormComProp; // 当前拖拽的表单控件
  componentList: FormComProp[]; // 当前编辑区的组件列表
  moveableOptions: { [key: string]: any }; // Moveable props
}
