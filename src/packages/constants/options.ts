import { OptionGroup } from "../typings/option";

export const options: OptionGroup[] = [
    {
        label: '输入型组件',
        key: 'input-group',
        value: 'input-group',
        icon: 'icon-input',
        children: [
            {
                label: '单行文本',
                key: 'Input',
                value: 'Input',
                icon: 'icon-input',
            },
            {
                label: '多行文本',
                key: 'Input.TextArea',
                value: 'Input.TextArea',
                icon: 'icon-textarea',
            },
            {
                label: '密码',
                key: 'Input.Password',
                value: 'Input.Password',
                icon: 'icon-password',
            },
            {
                label: '计数器',
                key: 'InputNumber',
                value: 'InputNumber',
                icon: 'icon-number',
            },
            {
                label: '编辑器',
                key: 'Editor',
                value: 'Editor',
                icon: 'icon-icon-editor',
            },
        ]
    },
    {
        label: '选择型组件',
        key: 'select-group',
        value: 'select-group',
        icon: 'icon-xuanze',
        children: [
            {
                label: '下拉选择',
                key: 'Select',
                value: 'Select',
                icon: 'icon-xiala',
            },
            {
                label: '级联选择',
                key: 'Cascader',
                value: 'Cascader',
                icon: 'icon-jilianxuanze',
            },
            {
                label: '单选框组',
                key: 'Radio',
                value: 'Radio',
                icon: 'icon-danxuan',
            },
            {
                label: '多选框组',
                key: 'Checkbox',
                value: 'Checkbox',
                icon: 'icon-duoxuan',
            },
            {
                label: '开关',
                key: 'Switch',
                value: 'Switch',
                icon: 'icon-kaiguan',
            },
            {
                label: '滑块',
                key: 'Slider',
                value: 'Slider',
                icon: 'icon-huakuai',
            },
            {
                label: '时间选择',
                key: 'TimePicker',
                value: 'TimePicker',
                icon: 'icon-date-1',
            },
            
            {
                label: '时间范围',
                key: 'TimePicker.RangePicker',
                value: 'TimePicker.RangePicker',
                icon: 'icon-shijianfanwei',
            },
            {
                label: '日期选择',
                key: 'DatePicker',
                value: 'DatePicker',
                icon: 'icon-riqi',
            },
            {
                label: '日期范围',
                key: 'DatePicker.RangePicker',
                value: 'DatePicker.RangePicker',
                icon: 'icon-riqifanwei',
            },
            {
                label: '评分',
                key: 'Rate',
                value: 'Rate',
                icon: 'icon-pingfen',
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
                icon: 'icon-shangchuan',
            },
        ]
    },
    {
        label: '布局型组件',
        key: 'layout-group',
        value: 'layout-group',
        icon: 'icon-layout',
        children: [
            {
                label: '行容器',
                key: 'Row',
                value: 'Row',
                icon: 'icon-hangrongqi',
            },
            {
                label: '按钮',
                key: 'Button',
                value: 'Button',
                icon: 'icon-Onebuttonalarm',
            },
        ]
    },
]
