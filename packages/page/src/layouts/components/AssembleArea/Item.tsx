import * as React from 'react'
import { getComponent } from '@r-generator/mapping'
import { isDateComponent } from '../../../utils/utils'

interface IItem {
  children: any
  type: any
  componentProps: any
}

export default function Item(prop: IItem) {
  const { children, type, componentProps } = prop

  const generateChildren = (
    children: any
  ): React.FunctionComponentElement<any>[] | undefined => {
    if (!(Array.isArray(children) && children.length)) return
    return children.map((item: any) => {
      const dateCompatibleProps = {} as any
      if (isDateComponent(item.type)) {
        dateCompatibleProps.disabled = true
      }
      return React.cloneElement(
        getComponent(item.type),
        {
          ...item.props,
          ...dateCompatibleProps,
        },
        generateChildren(item.children)
      )
    })
  }

  const renderChildren = (children: any) => {
    const result = generateChildren(children)
    return Array.isArray(result) ? result : []
  }

  return React.cloneElement(
    getComponent(type),
    componentProps,
    ...renderChildren(children)
  )
}
