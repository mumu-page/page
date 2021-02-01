export interface commonDispatch<T = boolean> {
    commonDispatch: React.Dispatch<{
        type: string;
        payload: T;
    }>
}

export type componentKeys = 'input' |
    'textarea' |
    'password' |
    'number' |
    'editor' |
    'select' |
    'cascader' |
    'radio' |
    'checkbox' |
    'switch' |
    'slider' |
    'time-picker' |
    'time-range-picker' |
    'date-picker' |
    'date-range-picker' |
    'rate' |
    'upload' |
    'row' |
    'button' |
    '';


export interface FormComProp {
    componentKey: componentKeys;            // 当前拖拽的控件key
    componentProps: object                   // 当前拖拽的控件属性设置
    formItemProps: object;                   // 当前FormItem属性设置
    /** The unique id associated with your item. It's recommended this is the same as the key prop for your list item. */
    id: string | number;
    /** When true, the item is selected using MultiDrag */
    selected?: boolean;
    /** When true, the item is deemed "chosen", which basically just a mousedown event. */
    chosen?: boolean;
    /** When true, it will not be possible to pick this item up in the list. */
    filtered?: boolean;
}

export interface FlagState extends commonDispatch<boolean> {
    flag: boolean;
}

export interface NotFoundState extends commonDispatch<boolean> {
    showNotFound: boolean;
}

export interface CommonState extends commonDispatch<object> {
    currentDragComponent: FormComProp;              // 当前拖拽的表单控件
    componentList: FormComProp[],                   // 当前编辑区的组件列表
}
