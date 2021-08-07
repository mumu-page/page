import { ItemInterface } from 'react-sortablejs'
import { shortid } from '@r-generator/shared'
import moment from 'moment'

export interface PoolGroup<T> {
  title: string
  children?: T[]
}

export interface PoolItem extends ItemInterface {
  /* 组件标识 */
  name: string
  /* 组件名称 */
  title: string
  /* 组件参数 */
  props?: { [name: string]: any }
  /* 组件预览图 */
  image?: string
  /* 组件的下级 */
  children?: PoolItem[]
}

export const FORM_POOLS: PoolGroup<PoolItem>[] = [
  {
    title: '输入型组件',
    children: [
      {
        title: '单行文本',
        name: 'form/item',
        props: { label: '单行文本' },
        id: shortid(),
        children: [
          {
            title: '单行文本',
            name: 'input',
            id: shortid(),
          },
        ],
      },
      {
        title: '多行文本',
        name: 'form/item',
        id: shortid(),
        props: { label: '多行文本' },
        children: [
          {
            title: '多行文本',
            name: 'input/text-area',
            id: 'input/text-area',
          },
        ],
      },

      {
        title: '密码',
        name: 'form/item',
        props: { label: '密码' },
        id: shortid(),
        children: [
          {
            title: '密码',
            name: 'input/password',
            id: 'input/password',
          },
        ],
      },
      {
        title: '计数器',
        name: 'form/item',
        id: shortid(),
        props: { label: '计数器' },
        children: [
          {
            title: '计数器',
            name: 'input-number',
            id: 'input-number',
          },
        ],
      },

      /* {
        title: "编辑器",
        name: "Editor",
      }, */
    ],
  },
  {
    title: '选择型组件',
    children: [
      {
        title: '下拉选择',
        name: 'form/item',
        props: { label: '下拉选择' },
        id: shortid(),
        children: [
          {
            title: '下拉选择',
            name: 'select',
            id: 'select',
          },
        ],
      },
      {
        title: '级联选择',
        name: 'form/item',
        id: shortid(),
        props: { label: '级联选择' },
        children: [
          {
            title: '级联选择',
            name: 'cascader',
            id: 'cascader',
          },
        ],
      },
      {
        title: '单选框组',
        name: 'form/item',
        id: shortid(),
        props: { label: '单选框组' },
        children: [
          {
            title: '单选框组',
            name: 'radio',
            id: 'radio',
          },
        ],
      },

      {
        title: '多选框组',
        name: 'form/item',
        id: shortid(),
        props: { label: '多选框组' },
        children: [
          {
            title: '多选框组',
            name: 'checkbox',
            id: 'checkbox',
          },
        ],
      },
      {
        title: '开关',
        name: 'form/item',
        props: { label: '开关' },
        id: shortid(),
        children: [
          {
            title: '开关',
            name: 'switch',
            id: 'switch',
          },
        ],
      },
      {
        title: '滑块',
        name: 'form/item',
        props: { label: '滑块' },
        id: shortid(),
        children: [
          {
            title: '滑块',
            name: 'slider',
            id: 'slider',
          },
        ],
      },
      {
        title: '时间选择',
        name: 'form/item',
        id: shortid(),
        props: { label: '时间选择' },
        children: [
          {
            title: '时间选择',
            name: 'time-picker',
            id: 'time-picker',
            props: {
              value: moment(),
            },
          },
        ],
      },
      {
        title: '时间范围',
        name: 'form/item',
        id: shortid(),
        props: { label: '时间范围' },
        children: [
          {
            title: '时间范围',
            name: 'time-picker/range-picker',
            id: 'time-picker/range-picker',
            props: {
              value: [moment(), moment()],
            },
          },
        ],
      },

      {
        title: '日期选择',
        name: 'form/item',
        id: shortid(),
        props: { label: '日期选择' },
        children: [
          {
            title: '日期选择',
            name: 'date-picker',
            id: 'date-picker',
            props: {
              value: moment(),
            },
          },
        ],
      },

      {
        title: '日期范围',
        name: 'form/item',
        props: { label: '日期范围' },
        id: shortid(),
        children: [
          {
            title: '日期范围',
            name: 'date-picker/range-picker',
            id: 'date-picker/range-picker',
            props: {
              value: [moment(), moment()],
            },
          },
        ],
      },
      {
        title: '评分',
        name: 'form/item',
        props: { label: '评分' },
        id: shortid(),
        children: [
          {
            title: '评分',
            name: 'rate',
            id: 'rate',
          },
        ],
      },
      {
        title: '上传',
        name: 'form/item',
        props: { label: '上传' },
        id: shortid(),
        children: [
          {
            title: '上传',
            name: 'upload',
            id: 'upload',
          },
        ],
      },

      // {
      //     title: '颜色选择',
      //     name: 'color',
      // },
    ],
  },
  {
    title: '布局型组件',
    children: [
      {
        title: '列表1',
        name: 'form/item',
        id: shortid(),
        props: { label: '列表1' },
        children: [
          {
            title: '列表1',
            name: 'list1',
            id: 'list1',
          },
        ],
      },

      /* {
        title: "行容器",
        name: "Col",
        value: "Col",
        icon: "icon-hangrongqi",
      },
      {
        title: "按钮",
        name: "Button",
        value: "Button",
        icon: "icon-Onebuttonalarm",
      }, */
    ],
  },
]
