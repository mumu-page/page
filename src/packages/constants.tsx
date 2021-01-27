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

interface ItemType {
    title: string;
    key: string;
    component?: JSX.Element;
    icon: string;
    children?: ItemType[]
}
export const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2351518_3b6485fr71i.js',
});
export const componentList: ItemType[] = [
    {
        title: '输入型组件',
        key: 'input-group',
        icon: 'icon-input',
        children: [
            {
                title: '单行文本',
                key: 'input',
                component: <InputProperties />,
                icon: 'icon-input',
            },
            {
                title: '多行文本',
                key: 'textarea',
                component: <TextAreaProperties />,
                icon: 'icon-textarea',
            },
            {
                title: '密码',
                key: 'password',
                component: <PasswordProperties />,
                icon: 'icon-password',
            },
            {
                title: '计数器',
                key: 'number',
                component: <NumberProperties />,
                icon: 'icon-shuzi',
            },
            {
                title: '编辑器',
                key: 'editor',
                component: <EditorProperties />,
                icon: 'icon-icon-editor',
            },
        ]
    },
    {
        title: '选择型组件',
        key: 'select-group',
        icon: 'icon-xuanze',
        children: [
            {
                title: '下拉选择',
                key: 'select',
                icon: 'icon-xiala',
                component: <SelectProperties />
            },
            {
                title: '级联选择',
                key: 'cascader',
                icon: 'icon-jilianxuanze',
                component: <CascaderProperties />
            },
            {
                title: '单选框组',
                key: 'radio',
                icon: 'icon-danxuan',
                component: <RadioProperties />
            },
            {
                title: '多选框组',
                key: 'checkbox',
                icon: 'icon-duoxuan',
                component: <CheckboxProperties />
            },
            {
                title: '开关',
                key: 'switch',
                icon: 'icon-kaiguan',
                component: <SwitchProperties />
            },
            {
                title: '滑块',
                key: 'slider',
                icon: 'icon-huakuai',
                component: <SliderProperties />
            },
            {
                title: '时间选择',
                key: 'time-picker',
                icon: 'icon-date-1',
                component: <TimePickerProperties />
            },
            {
                title: '时间范围',
                key: 'time-range-picker',
                icon: 'icon-shijianfanwei',
                component: <TimeRangePickerProperties />
            },
            {
                title: '日期选择',
                key: 'date-picker',
                icon: 'icon-riqi',
                component: <DatePickerProperties />
            },
            {
                title: '日期范围',
                key: 'date-range-picker',
                icon: 'icon-riqifanwei',
                component: <DateRangePickerProperties />
            },
            {
                title: '评分',
                key: 'rate',
                icon: 'icon-pingfen',
                component: <RateProperties />
            },
            // {
            //     title: '颜色选择',
            //     key: 'color',
            //     icon: 'icon-yanse',
            // },
            {
                title: '上传',
                key: 'upload',
                icon: 'icon-shangchuan',
                component: <UploadProperties />
            },
        ]
    },
    {
        title: '布局型组件',
        key: 'layout-group',
        icon: 'icon-input',
        children: [
            {
                title: '行容器',
                key: 'row',
                icon: 'icon-hangrongqi',
                component: <RowProperties />
            },
            {
                title: '按钮',
                key: 'button',
                icon: 'icon-Onebuttonalarm',
                component: <ButtonProperties />
            },
        ]
    },
]