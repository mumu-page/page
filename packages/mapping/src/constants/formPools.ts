import { shortid } from '@r-generator/shared'
import { PoolGroup, PoolItem } from '@r-generator/stores'
import { getAllType } from '../utils'

export const FORM_POOLS: PoolGroup<PoolItem>[] = [
  {
    label: '输入型组件',
    children: [
      {
        label: '单行文本',
        type: 'form/item',
        props: { label: '单行文本' },
        id: shortid(),
        children: [
          {
            label: '单行文本',
            type: 'input',
            id: shortid(),
          },
        ],
      },
      {
        label: '多行文本',
        type: 'form/item',
        id: shortid(),
        props: { label: '多行文本' },
        children: [
          {
            label: '多行文本',
            type: 'input/text-area',
            id: 'input/text-area',
          },
        ],
      },
      {
        label: '密码',
        type: 'form/item',
        props: { label: '密码' },
        id: shortid(),
        children: [
          {
            label: '密码',
            type: 'input/password',
            id: 'input/password',
          },
        ],
      },
      {
        label: '计数器',
        type: 'form/item',
        id: shortid(),
        props: { label: '计数器' },
        children: [
          {
            label: '计数器',
            type: 'input-number',
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
    label: '选择型组件',
    children: [
      {
        label: '下拉选择',
        type: 'form/item',
        props: { label: '下拉选择' },
        id: shortid(),
        children: [
          {
            label: '下拉选择',
            type: 'select',
            id: 'select',
          },
        ],
      },
      {
        label: '级联选择',
        type: 'form/item',
        id: shortid(),
        props: { label: '级联选择' },
        children: [
          {
            label: '级联选择',
            type: 'cascader',
            id: 'cascader',
          },
        ],
      },
      {
        label: '单选框组',
        type: 'form/item',
        id: shortid(),
        props: { label: '单选框组' },
        children: [
          {
            label: '单选框组',
            type: 'radio',
            id: 'radio',
          },
        ],
      },
      {
        label: '多选框组',
        type: 'form/item',
        id: shortid(),
        props: { label: '多选框组' },
        children: [
          {
            label: '多选框组',
            type: 'checkbox',
            id: 'checkbox',
          },
        ],
      },
      {
        label: '开关',
        type: 'form/item',
        props: { label: '开关' },
        id: shortid(),
        children: [
          {
            label: '开关',
            type: 'switch',
            id: 'switch',
          },
        ],
      },
      {
        label: '滑块',
        type: 'form/item',
        props: { label: '滑块' },
        id: shortid(),
        children: [
          {
            label: '滑块',
            type: 'slider',
            id: 'slider',
          },
        ],
      },
      {
        label: '时间选择',
        type: 'form/item',
        id: shortid(),
        props: { label: '时间选择' },
        children: [
          {
            label: '时间选择',
            type: 'time-picker',
            id: 'time-picker',
            props: {
              value: '',
            },
          },
        ],
      },
      {
        label: '时间范围',
        type: 'form/item',
        id: shortid(),
        props: { label: '时间范围' },
        children: [
          {
            label: '时间范围',
            type: 'time-picker/range-picker',
            id: 'time-picker/range-picker',
            props: {
              value: [],
            },
          },
        ],
      },
      {
        label: '日期选择',
        type: 'form/item',
        id: shortid(),
        props: { label: '日期选择' },
        children: [
          {
            label: '日期选择',
            type: 'date-picker',
            id: 'date-picker',
            props: {
              value: '',
            },
          },
        ],
      },
      {
        label: '日期范围',
        type: 'form/item',
        props: { label: '日期范围' },
        id: shortid(),
        children: [
          {
            label: '日期范围',
            type: 'date-picker/range-picker',
            id: 'date-picker/range-picker',
            props: {
              value: [],
            },
          },
        ],
      },
      {
        label: '评分',
        type: 'form/item',
        props: { label: '评分' },
        id: shortid(),
        children: [
          {
            label: '评分',
            type: 'rate',
            id: 'rate',
          },
        ],
      },
      {
        label: '上传',
        type: 'form/item',
        props: { label: '上传' },
        id: shortid(),
        children: [
          {
            label: '上传',
            type: 'upload',
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
    label: '布局型组件',
    children: [
      {
        label: '列表1',
        type: 'form/item',
        id: shortid(),
        props: { label: '列表1' },
        children: [
          {
            label: '列表1',
            type: 'list1',
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

const componentList: PoolItem[] = []
FORM_POOLS.forEach((item) => {
  if (Array.isArray(item.children)) {
    componentList.concat(item.children)
  }
})

export const ALL_FORM_TYPES = Array.from(getAllType(componentList))
