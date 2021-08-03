export interface ISetGlobal<T = boolean> {
  setGlobal: React.Dispatch<{
    type: string
    payload?: T
  }>
}

export type IComponentKeys =
  | 'Input'
  | 'Input.TextArea'
  | 'Input.Password'
  | 'InputNumber'
  | 'Editor'
  | 'Select'
  | 'Cascader'
  | 'Radio'
  | 'Checkbox'
  | 'Switch'
  | 'Slider'
  | 'TimePicker'
  | 'TimePicker.RangePicker'
  | 'DatePicker'
  | 'DatePicker.RangePicker'
  | 'Rate'
  | 'Upload'
  | 'Col'
  | 'Button'
  | 'List1'
  | ''

export interface IFormComProp {
  componentKey: IComponentKeys // 当前拖拽的控件key
  componentProps: Record<string, any> // 当前拖拽的控件属性设置
  formProps?: Record<string, any> // 当前Form属性设置
  formItemProps: Record<string, any> // 当前FormItem属性设置
  colProps: Record<string, any> // 当前Col属性设置
  rowProps?: Record<string, any> // 当前Row属性设置
  layout?: Record<string, any> //布局属性
  [key: string]: any
  children?: IFormComProp[]
  id: string
}

export interface IMoveableOptions {
  elClassName: string | null
  [key: string]: any
}

export type IMode = 'form' | 'page' 

export interface ICommonState extends ISetGlobal<object> {
  target: IFormComProp // 当前拖拽的表单控件
  componentList: IFormComProp[] // 当前编辑区的组件列表
  moveableOptions: IMoveableOptions // Moveable props
  mode: IMode // 设计区模式
  [key:string]: any
}
