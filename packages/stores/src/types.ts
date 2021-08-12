export interface ISetGlobal<T = boolean> {
  setGlobal: React.Dispatch<{
    type: string
    payload?: T
  }>
}

export interface IMoveableOptions {
  elClassName: string | null
  [key: string]: any
}

/**
 * draw 自由绘制
 * assemble 页面组装
 */
export type IMode = 'draw' | 'assemble'

export type IActionType =
  | ''
  | 'history'
  | 'form-pool'
  | 'base-pool'
  | 'chart-pool'
  | 'swtich'
  | 'run'
  | 'clean'
  | 'copy'
  | 'download'
  | 'setting'
  | 'preview'
  | 'center'
  | string

/**
 * flexible: 弹性布局
 * mobility: 流动布局
 */
export type ILayoutType = 'flexible' | 'mobility'

export interface ItemInterface {
  /** The unique id associated with your item. It's recommended this is the same as the key prop for your list item. */
  id: string | number
  /** When true, the item is selected using MultiDrag */
  selected?: boolean
  /** When true, the item is deemed "chosen", which basically just a mousedown event. */
  chosen?: boolean
  /** When true, it will not be possible to pick this item up in the list. */
  filtered?: boolean
  [property: string]: any
}

export interface PoolGroup<T> {
  label: string
  children?: T[]
}

export interface PoolItem extends ItemInterface {
  /* 组件标识 */
  type: string
  /* 组件名称 */
  label: string
  /* 组件参数 */
  props?: { [name: string]: any }
  /* 组件预览图 */
  image?: string
  /* 组件的下级 */
  children?: PoolItem[]
  [key: string]: any
}

export interface ICommonProps {
  /* 布局 */
  layout: {[key: string]: any}
  /* 表单 */
  form: {[key: string]: any}
  [key: string]: any
}

export interface ICommonState extends ISetGlobal<object> {
  /* 当前拖拽的表单控件 */
  target: PoolItem
  /* 当前编辑区的组件列表 */
  componentList: PoolItem[]
  /* props */
  moveableOptions: IMoveableOptions
  /* 设计区模式 */
  mode: IMode
  actionType: IActionType
  layoutType: ILayoutType
  /* 公共参数 */
  commonProps: ICommonProps
  [key: string]: any
}
