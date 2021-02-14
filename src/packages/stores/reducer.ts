import {
  SET_CURRENT_DRAG_COMPONENT,
  SET_COMPONENT_LIST,
  DEL_COMPONENT_LIST,
  PUT_COMPONENT_LIST,
  INSERT_COMPONENT_LIST,
  UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
  UPDATE_COMPONENT_LIST_AND_CURRENT_DRAG,
  SET_CURRENT_DRAG_COMPONENT_BY_COMPONENT_LIST,
  DELETE_ALL_COMPONENT_LIST_AND_CURRENT_DRAG,
  UPDATE_COMPONENT_LIST_OF_ITEM_CHILDREN,
} from './action-type'
import { CommonState } from './typings'
import { merge, cloneDeep } from 'lodash'
import produce from 'immer'

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
          draft.currentDragComponent,
          action.payload
        )
      },
      [SET_CURRENT_DRAG_COMPONENT_BY_COMPONENT_LIST]: () => {
        draft.componentList.forEach((item) => {
          if (item?.id === action.payload?.id) {
            draft.currentDragComponent = item
          }
        })
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
        }
      },
      /* 设置组件列表，并根据当前选中的组件，设置其他组件为未选中 */
      [SET_COMPONENT_LIST]: () => {
        const newState = cloneDeep(action.payload?.newState)
        newState?.map((item: { id: any; chosen: boolean }) => {
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
        draft.componentList = newState
      },
      [DEL_COMPONENT_LIST]: () => {
        for (let i = 0; i < draft?.componentList.length; i++) {
          if (draft?.componentList[i].id === action.payload?.id) {
            draft?.componentList.splice(i, 1)
            break
          }
        }
      },
      [PUT_COMPONENT_LIST]: () => {
        const componentList = draft?.componentList?.map((item) => {
          item.chosen = false
          return item
        })
        componentList.push(action.payload)
        draft.componentList = componentList
      },
      [INSERT_COMPONENT_LIST]: () => {
        const { index, data } = action.payload
        const componentList = draft.componentList
        componentList.splice(index, 0, data)
        draft.componentList = componentList
      },
      [UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG]: () => {
        const { data = {} } = action.payload || {}
        draft?.componentList?.map((item, index) => {
          if (item.id === draft.currentDragComponent?.id) {
            draft.currentDragComponent[index] = merge(item, data)
          }
          return item
        })
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
      // 更新容器中的列表组件
      [UPDATE_COMPONENT_LIST_OF_ITEM_CHILDREN]: () => {
        const { id, children = {} } = action.payload || {}
        const componentList = draft?.componentList?.map((item) => {
          if (item.id === id) {
            item.children = children
          }
          return item
        })
        draft.componentList = componentList
      },
    }

    if (typeof strategy[action.type] === 'function') {
      console.table({
        [action.type]: strategy[action.type](),
        payload: action.payload,
      })
      strategy[action.type]()
    }
  }
)
