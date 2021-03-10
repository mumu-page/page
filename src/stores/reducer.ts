import {
  SET_CURRENT_DRAG_COMPONENT,
  SET_COMPONENT_LIST,
  DEL_COMPONENT_LIST,
  COPY_COMPONENT_LIST,
  INSERT_COMPONENT_LIST,
  UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
  UPDATE_COMPONENT_LIST_AND_CURRENT_DRAG,
  SET_CURRENT_DRAG_COMPONENT_BY_COMPONENT_LIST,
  DELETE_ALL_COMPONENT_LIST_AND_CURRENT_DRAG,
  UPDATE_COMPONENT_LIST_OF_ITEM_CHILDREN,
  PUT_COMPONENT_LIST,
  SET_MOVEABLE_OPTIONS,
} from './action-type'
import { CommonState, FormComProp } from './typings'
import { merge, cloneDeep } from 'lodash'
import produce from 'immer'
import * as uuid from 'uuid'
import { INITAL_STATE } from './context'

/**
 * 公共
 * @param state
 * @param action
 */
export const commonReducer = produce(
  (draft: CommonState, action: { type: string; payload?: any }) => {
    const strategy: { [key: string]: () => void } = {
      [SET_CURRENT_DRAG_COMPONENT]: () => {
        draft.currentDragComponent = merge(
          cloneDeep(draft.currentDragComponent),
          cloneDeep(action.payload)
        )
      },
      [SET_CURRENT_DRAG_COMPONENT_BY_COMPONENT_LIST]: () => {
        const findSelectedItem = (data: FormComProp[]) => {
          for (var i = 0; i < data.length; i++) {
            const item = data[i]
            if (item?.children?.length) {
              findSelectedItem(item?.children)
            }
            if (item?.id === action.payload?.id) {
              draft.currentDragComponent = item
              break
            }
          }
        }
        findSelectedItem(draft.componentList)
      },
      // 清空控件列表和当前拖拽控件数据
      [DELETE_ALL_COMPONENT_LIST_AND_CURRENT_DRAG]: () => {
        draft.componentList = []
        draft.currentDragComponent = {
          id: '',
          componentKey: '',
          formItemProps: {},
          componentProps: {},
          colProps: {},
          rowProps: {},
        }
      },
      [PUT_COMPONENT_LIST]: () => {
        for (let i = 0; i < draft.componentList?.length; i++) {
          const item = draft.componentList[i]
          if (item.id === action.payload?.id) {
            return
          }
          item.chosen = false
        }
        draft.componentList?.push(action.payload)
      },
      /* 设置组件列表，并根据当前选中的组件，设置其他组件为未选中 */
      [SET_COMPONENT_LIST]: () => {
        let newState = cloneDeep(action.payload?.newState)
        newState = newState?.map(
          (item: { id: any; chosen: boolean; children: any[] }) => {
            if (
              item?.id ===
              (action.payload?.currentId || draft.currentDragComponent?.id)
            ) {
              item.chosen = true
            } else {
              item.chosen = false
            }
            if (item?.children) {
              item?.children?.forEach((cItem, cIndex) => {
                cItem.chosen = false
              })
            }
            return item
          }
        )
        draft.componentList = newState
      },
      // 更新容器中的列表组件
      [UPDATE_COMPONENT_LIST_OF_ITEM_CHILDREN]: () => {
        const { id, children = [] } = action.payload || {}
        let _children = cloneDeep(children)
        _children = _children?.map((item: { id: any; chosen: boolean }) => {
          if (
            item?.id ===
            (action.payload?.currentId || draft.currentDragComponent?.id)
          ) {
            item.chosen = true
          } else {
            item.chosen = false
          }
          return item
        })
        draft?.componentList?.forEach((item, index) => {
          item.chosen = false
          if (item?.children) {
            item.children?.forEach((cItem) => {
              cItem.chosen = false
            })
          }
          if (item.id === id) {
            item.children = _children
          }
        })
      },
      [DEL_COMPONENT_LIST]: () => {
        const findDelItem = (data: FormComProp[]) => {
          for (let i = 0; i < data?.length; i++) {
            if (data[i]?.children) {
              findDelItem(draft.componentList[i].children as FormComProp[])
            }
            if (data[i].id === action.payload?.id) {
              data.splice(i, 1)
              break
            }
          }
        }
        findDelItem(draft?.componentList)
      },
      [COPY_COMPONENT_LIST]: () => {
        let newItem = {} as FormComProp
        const newId = uuid.v4()
        const findCopyItem = (data: FormComProp[]) => {
          data?.forEach((item, index) => {
            data[index].chosen = false
            if (item?.children) {
              findCopyItem(item?.children)
            }
            if (item.id === action.payload?.id) {
              newItem = {
                ...item,
                id: newId,
                key: newId,
                chosen: true,
              }
              data.push(newItem)
              draft.currentDragComponent = newItem
            }
          })
        }
        findCopyItem(draft?.componentList)
      },
      [INSERT_COMPONENT_LIST]: () => {
        const { index, data } = action.payload
        draft.componentList.splice(index, 0, data)
      },
      [UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG]: () => {
        const { data = {} } = action.payload || {}
        const findCurrent = (coms: FormComProp[]) => {
          coms?.forEach((item, index) => {
            if (item.id === draft.currentDragComponent?.id) {
              item = merge(item, data)
            }
            if (item?.children) {
              findCurrent(item.children)
            }
          })
        }
        findCurrent(draft?.componentList)
      },
      // 同时更新当前选中控件和设计区控件列表
      [UPDATE_COMPONENT_LIST_AND_CURRENT_DRAG]: () => {
        const { componentKey, newComponentProps } = action.payload || {}
        const componentList = draft?.componentList?.map((item) => {
          if (item.id === draft.currentDragComponent?.id) {
            item.componentKey = componentKey
            item.componentProps = {
              ...item.componentProps,
              ...newComponentProps,
            }
          }
          return item
        })
        draft.currentDragComponent.componentKey = componentKey
        draft.currentDragComponent.componentProps = newComponentProps
        draft.componentList = componentList
      },
      [SET_MOVEABLE_OPTIONS]: () => {
        draft.moveableOptions = merge(
          draft.moveableOptions,
          cloneDeep(action.payload)
        )
      },
    }

    if (typeof strategy[action.type] === 'function') {
      // console.table({
      //   [action.type]: strategy[action.type](),
      //   payload: action.payload,
      // });
      strategy[action.type]()
    }
  },
  INITAL_STATE
)
