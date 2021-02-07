import React, { memo, useEffect } from 'react'
import { Form } from 'antd'
import { FormComProp, commonDispatch } from '../../stores/typings'
import {
  SET_COMPONENT_LIST,
  SET_CURRENT_DRAG_COMPONENT,
  SET_CURRENT_DRAG_COMPONENT_BY_COMPONENT_LIST,
} from '../../stores/action-type'
import { ReactSortable } from 'react-sortablejs'
import { GLOBAL_STATE } from '../../stores/state'
import SortableItem from './SortableItem'
import { isDatePicker } from '../../utils/utils'
import { canChosen } from './data'
import { areEqualIndex } from './utils'

interface EditorAreaProps extends commonDispatch<object> {
  componentList: FormComProp[]
  currentDragComponent: FormComProp
}
export default memo((props: EditorAreaProps) => {
  const { currentDragComponent, componentList, commonDispatch } = props
  const [form] = Form.useForm()

  useEffect(() => {
    const { componentProps, formItemProps } = currentDragComponent
    form.setFieldsValue({
      [formItemProps.name]: componentProps?.defaultValue,
    })
  }, [currentDragComponent, form])

  useEffect(() => {
    const _initialValues = {} as any
    componentList.forEach((item) => {
      const { componentKey, formItemProps, componentProps } = item
      const { name } = formItemProps || {}
      const { defaultValue } = componentProps || {}
      if (!isDatePicker(componentKey)) {
        _initialValues[name] = defaultValue
      }
    })
    form.setFieldsValue(_initialValues)
  }, [componentList, form])

  return (
    <Form
      style={{
        height:'100%' ,
        position: 'relative',
      }}
      form={form}
    >
      <ReactSortable
        sort
        className='sortable-list'
        style={{
          height: '100%' ,
        }}
        group={{
          name: 'editor-area',
          put: true,
        }}
        list={componentList}
        ghostClass="sortable-ghost"
        chosenClass="sortable-chosen"
        animation={200}
        fallbackTolerance={5}
        delayOnTouchOnly
        setList={(newState) => {
          commonDispatch({
            type: SET_COMPONENT_LIST,
            payload: {
              currentId: GLOBAL_STATE?.currentDragComponent?.id,
              newState,
            },
          })
        }}
        onAdd={(e) => {
          commonDispatch({
            type: SET_CURRENT_DRAG_COMPONENT,
            payload: GLOBAL_STATE.currentDragComponent,
          })
        }}
        onUnchoose={(e) => {
          if (!canChosen.value) return
          GLOBAL_STATE.currentDragComponent.id = e.item.dataset?.id || ''
          commonDispatch({
            type: SET_CURRENT_DRAG_COMPONENT_BY_COMPONENT_LIST,
            payload: { id: e.item.dataset.id },
          })
        }}
      >
        {componentList.map((item: any) => {
          return (
            <div key={item.id} className='sortable-item-wrap'>
              <SortableItem
                id={item.id}
                key={item.id}
                form={form}
                formItemProps={item.formItemProps}
                componentProps={item.componentProps}
                componentKey={item.componentKey}
              />
            </div>
          )
        })}
      </ReactSortable>
    </Form>
  )
}, areEqualIndex)
