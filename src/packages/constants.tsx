import { createFromIconfontCN } from "@ant-design/icons";
import {
    InputProperties,
    TextAreaProperties,
    PasswordProperties,
    NumberProperties,
    EditorProperties,
    SelectProperties,
    CascaderProperties,
    RadioProperties,
    CheckboxProperties,
    SwitchProperties,
    SliderProperties,
    TimePickerProperties,
    TimeRangePickerProperties,
    DatePickerProperties,
    DateRangePickerProperties,
    RateProperties,
    UploadProperties,
    RowProperties,
    ButtonProperties,
} from "./properties";
import {
    Input,
    InputNumber,
    Select,
    Cascader,
    Radio,
    Checkbox,
    Switch,
    Slider,
    TimePicker,
    DatePicker,
    Rate,
    Upload,
    Row,
    Button,
} from "antd";

interface ItemType {
    label: string;
    key: string;
    value: string;
    icon: string;
    children?: ItemType[]
}
export const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2351518_3b6485fr71i.js',
});

export const options: ItemType[] = [
    {
        label: '输入型组件',
        key: 'input-group',
        value: 'input-group',
        icon: 'icon-input',
        children: [
            {
                label: '单行文本',
                key: 'input',
                value: 'input',
                icon: 'icon-input',
            },
            {
                label: '多行文本',
                key: 'textarea',
                value: 'textarea',
                icon: 'icon-textarea',
            },
            {
                label: '密码',
                key: 'password',
                value: 'password',
                icon: 'icon-password',
            },
            {
                label: '计数器',
                key: 'number',
                value: 'number',
                icon: 'icon-shuzi',
            },
            {
                label: '编辑器',
                key: 'editor',
                value: 'editor',
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
                key: 'select',
                value: 'select',
                icon: 'icon-xiala',
            },
            {
                label: '级联选择',
                key: 'cascader',
                value: 'cascader',
                icon: 'icon-jilianxuanze',
            },
            {
                label: '单选框组',
                key: 'radio',
                value: 'radio',
                icon: 'icon-danxuan',
            },
            {
                label: '多选框组',
                key: 'checkbox',
                value: 'checkbox',
                icon: 'icon-duoxuan',
            },
            {
                label: '开关',
                key: 'switch',
                value: 'switch',
                icon: 'icon-kaiguan',
            },
            {
                label: '滑块',
                key: 'slider',
                value: 'slider',
                icon: 'icon-huakuai',
            },
            {
                label: '时间选择',
                key: 'time-picker',
                value: 'time-picker',
                icon: 'icon-date-1',
            },
            {
                label: '时间范围',
                key: 'time-range-picker',
                value: 'time-range-picker',
                icon: 'icon-shijianfanwei',
            },
            {
                label: '日期选择',
                key: 'date-picker',
                value: 'date-picker',
                icon: 'icon-riqi',
            },
            {
                label: '日期范围',
                key: 'date-range-picker',
                value: 'date-range-picker',
                icon: 'icon-riqifanwei',
            },
            {
                label: '评分',
                key: 'rate',
                value: 'rate',
                icon: 'icon-pingfen',
            },
            // {
            //     title: '颜色选择',
            //     key: 'color',
            //     icon: 'icon-yanse',
            // },
            {
                label: '上传',
                key: 'upload',
                value: 'upload',
                icon: 'icon-shangchuan',
            },
        ]
    },
    {
        label: '布局型组件',
        key: 'layout-group',
        value: 'layout-group',
        icon: 'icon-input',
        children: [
            {
                label: '行容器',
                key: 'row',
                value: 'row',
                icon: 'icon-hangrongqi',
            },
            {
                label: '按钮',
                key: 'button',
                value: 'button',
                icon: 'icon-Onebuttonalarm',
            },
        ]
    },
]

export const key2Component = {
    input: {
        properties: <InputProperties />,
        component: <Input />
    },
    textarea: {
        properties: <TextAreaProperties />,
        component: <Input.TextArea />
    },
    password: {
        properties: <PasswordProperties />,
        component: <Input.Password />
    },
    number: {
        properties: <NumberProperties />,
        component: <InputNumber />
    },
    editor: {
        properties: <EditorProperties />,
        component: <>editor</>
    },
    select: {
        properties: <SelectProperties />,
        component: <Select />
    },
    cascader: {
        properties: <CascaderProperties />,
        component: <Cascader />
    },
    radio: {
        properties: <RadioProperties />,
        component: <Radio />
    },
    checkbox: {
        properties: <CheckboxProperties />,
        component: <Checkbox />
    },
    switch: {
        properties: <SwitchProperties />,
        component: <Switch />
    },
    slider: {
        properties: <SliderProperties />,
        component: <Slider />
    },
    'time-picker': {
        properties: <TimePickerProperties />,
        component: <TimePicker />
    },
    'time-range-picker': {
        properties: <TimeRangePickerProperties />,
        component: <TimePicker.RangePicker />
    },
    'date-picker': {
        properties: <DatePickerProperties />,
        component: <DatePicker />
    },
    'date-range-picker': {
        properties: <DateRangePickerProperties />,
        component: <DatePicker.RangePicker />
    },
    rate: {
        properties: <RateProperties />,
        component: <Rate />
    },
    upload: {
        properties: <UploadProperties />,
        component: <Upload />
    },
    row: {
        properties: <RowProperties />,
        component: <Row />
    },
    button: {
        properties: <ButtonProperties />,
        component: <Button />
    },
    '': {
        properties: <></>,
        component: <></>
    }
}