import { IComponentKeys } from '@r-generator/stores'

export interface FormOption {
  label: string
  key: string
  value: string
  children?: OptionItem[]
}

export interface OptionItem {
  label: string
  key: string
  value: IComponentKeys
}

export const formOptions: FormOption[] = [
  {
    label: '输入型组件',
    key: 'input-group',
    value: 'input-group',
    children: [
      {
        label: '单行文本',
        key: 'Input',
        value: 'Input',
      },
      {
        label: '多行文本',
        key: 'Input.TextArea',
        value: 'Input.TextArea',
      },
      {
        label: '密码',
        key: 'Input.Password',
        value: 'Input.Password',
      },
      {
        label: '计数器',
        key: 'InputNumber',
        value: 'InputNumber',
      },
      /* {
        label: "编辑器",
        key: "Editor",
        value: "Editor",
        icon: "icon-icon-editor",
      }, */
    ],
  },
  {
    label: '选择型组件',
    key: 'select-group',
    value: 'select-group',
    children: [
      {
        label: '下拉选择',
        key: 'Select',
        value: 'Select',
      },
      {
        label: '级联选择',
        key: 'Cascader',
        value: 'Cascader',
      },
      {
        label: '单选框组',
        key: 'Radio',
        value: 'Radio',
      },
      {
        label: '多选框组',
        key: 'Checkbox',
        value: 'Checkbox',
      },
      {
        label: '开关',
        key: 'Switch',
        value: 'Switch',
      },
      {
        label: '滑块',
        key: 'Slider',
        value: 'Slider',
      },
      {
        label: '时间选择',
        key: 'TimePicker',
        value: 'TimePicker',
      },

      {
        label: '时间范围',
        key: 'TimePicker.RangePicker',
        value: 'TimePicker.RangePicker',
      },
      {
        label: '日期选择',
        key: 'DatePicker',
        value: 'DatePicker',
      },
      {
        label: '日期范围',
        key: 'DatePicker.RangePicker',
        value: 'DatePicker.RangePicker',
      },
      {
        label: '评分',
        key: 'Rate',
        value: 'Rate',
      },
      // {
      //     title: '颜色选择',
      //     key: 'color',
      //     icon: 'icon-yanse',
      // },
      {
        label: '上传',
        key: 'Upload',
        value: 'Upload',
      },
    ],
  },
  {
    label: '布局型组件',
    key: 'layout-group',
    value: 'layout-group',
    children: [
      {
        label: '列表1',
        key: 'List1',
        value: 'List1',
      },
      /* {
        label: "行容器",
        key: "Col",
        value: "Col",
        icon: "icon-hangrongqi",
      },
      {
        label: "按钮",
        key: "Button",
        value: "Button",
        icon: "icon-Onebuttonalarm",
      }, */
    ],
  },
]
