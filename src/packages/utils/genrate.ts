import React from 'react'
import { FormComProp } from "../stores/typings";
import {key2Component} from '../constants'

export function createForm() {

}

export function createFormItem(item: FormComProp) {
    const {formItemProps, componentProps, componentKey} = item
    let formItemPropsStr = ''
    let componentPropsStr = ''
    Object.keys(formItemProps).forEach(key => {
        const value = formItemProps[key]
        formItemPropsStr += ` ${key}={${value}}`
    })
    Object.keys(componentProps).forEach(key => {
        const value = formItemProps[key]
        componentPropsStr += ` ${key}={${value}}`
    })
    let ret = `<Form.Item ${formItemPropsStr}>
        <${componentKey} ${componentPropsStr} />
    </Form.Item>`
    return ret
}

export function generate(componentList: FormComProp[]) {
    let ret = ''
    componentList.forEach(item => {
        ret += createFormItem(item)
    })
    return ret
}