import React, { memo, useContext, useEffect } from 'react'
import { Form } from 'antd'
import { Context } from '../../stores/context'
import { FormComProp, commonDispatch } from '../../stores/typings'
import {
  SET_COMPONENT_LIST,
  SET_CURRENT_DRAG_COMPONENT,
} from '../../stores/action-type'
import { ReactSortable } from 'react-sortablejs'
import { GLOBAL_STATE } from '../../stores/state'
import SortableItem from './SortableItem'
import { isDatePicker } from '../../utils/utils'
import { canChosen } from './data'
import { areEqual } from './utils'

interface EditorAreaProps extends commonDispatch<object> {
  componentList: FormComProp[]
  currentDragComponent: FormComProp
}
const EditorArea = memo((props: EditorAreaProps) => {
  const { currentDragComponent, componentList, commonDispatch } = props
  const [form] = Form.useForm()
  console.log('componentList', componentList)

  const setChosen = (newState: FormComProp[]) => {
    return newState?.map((item) => {
      let ret = {
        ...item,
      }
      if (GLOBAL_STATE?.currentDragComponent?.id === item.id) {
        ret.chosen = true
      } else {
        ret.chosen = false
      }
      return ret
    })
  }

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
        height: '100%',
        position: 'relative',
      }}
      form={form}
    >
      <ReactSortable
        sort
        style={{
          height: '100%',
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
          let params = setChosen(newState)
          commonDispatch({
            type: SET_COMPONENT_LIST,
            payload: params,
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
          // FIX: 避免更新带来的卡顿
          const allDIV = e.target.childNodes
          allDIV.forEach((item: any) => {
            item.className = ''
          })
          e.item.className = 'sortable-chosen'
          let currentDrag: any = {}
          componentList.forEach((item) => {
            if (e.item.dataset.id === item.id) {
              currentDrag = item
            }
          })
          commonDispatch({
            type: SET_CURRENT_DRAG_COMPONENT,
            payload: currentDrag,
          })
        }}
      >
        {componentList.map((item: any) => {
          return (
            <div key={item.id}>
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
}, areEqual)

export default () => {
  const { currentDragComponent, componentList, commonDispatch } = useContext(
    Context
  )
  return (
    <>
      <EditorArea
        currentDragComponent={currentDragComponent}
        componentList={componentList}
        commonDispatch={commonDispatch}
      />
      {componentList.length === 0 && (
        <div className="not-found-info">从左侧拖入或点选组件进行表单设计</div>
      )}
    </>
  )
}
