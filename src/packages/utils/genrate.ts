import React from 'react'
import { FormComProp } from "../stores/typings";
import {key2Component} from '../constants'

function createFormItem(item: FormComProp) {
    const {formItemProps, componentProps, componentKey} = item
    let formItemPropsStr = ''
    let componentPropsStr = ''
    Object.keys(formItemProps).forEach(key => {
        const value = JSON.stringify(formItemProps[key])
        if(typeof value !== 'undefined') {
            formItemPropsStr += ` ${key}={${value}}`
        }
    })
    Object.keys(componentProps).forEach(key => {
        const value = JSON.stringify(componentProps[key])
        if(typeof value !== 'undefined') {
            componentPropsStr += ` ${key}={${value}}`
        }
    })
    let ret = `<Form.Item${formItemPropsStr}>
        <${componentKey}${componentPropsStr} />
    </Form.Item>`
    return ret
}

function generate(componentList: FormComProp[]) {
    let ret = ''
    componentList.forEach(item => {
        ret += createFormItem(item)
    })
    return `<Form>
        ${ret}
    </Form>`
}

export {
    generate
}