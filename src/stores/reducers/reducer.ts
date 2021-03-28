import {
  SET_TARGET,
  SET_COMPONENT_LIST,
  DEL_COMPONENT_LIST,
  COPY_COMPONENT_LIST,
  INSERT_COMPONENT_LIST,
  UPDATE_COMPONENT_LIST_BY_TARGET,
  UPDATE_COMPONENT_LIST_AND_TARGET,
  SET_TARGET_BY_COMPONENT_LIST,
  DELETE_ALL_COMPONENT_LIST_AND_TARGET,
  UPDATE_COMPONENT_LIST_OF_ITEM_CHILDREN,
  PUT_COMPONENT_LIST,
  SET_MOVEABLE_OPTIONS,
  DELETE_TARGET,
  RESET_COMPONENT_LAYOUT,
} from '../action-type'
import { ICommonState, IFormComProp } from '../typings'
import { merge, cloneDeep, isInteger } from 'lodash'
import produce from 'immer'
import { INITAL_STATE } from '../context'
import shortid from 'shortid'

/**
 * 公共
 * @param state
 * @param action
 */
export const commonReducer = produce(
  (draft: ICommonState, action: { type: string; payload?: any }) => {
    const strategy: { [key: string]: () => void } = {
      [SET_TARGET]: () => {
        draft.target = merge(cloneDeep(draft.target), cloneDeep(action.payload))
      },
      [DELETE_TARGET]: () => {
        draft.target = INITAL_STATE.target
      },
      [SET_TARGET_BY_COMPONENT_LIST]: () => {
        const findSelectedItem = (data: IFormComProp[]) => {
          for (var i = 0; i < data.length; i++) {
            const item = data[i]
            if (item?.children?.length) {
              findSelectedItem(item?.children)
            }
            if (item?.id === action.payload?.id) {
              item.rowProps = draft.target?.rowProps
              item.formProps = draft.target?.formProps
              draft.target = item
              break
            }
          }
        }
        findSelectedItem(draft.componentList)
      },
      // 清空控件列表和当前拖拽控件数据
      [DELETE_ALL_COMPONENT_LIST_AND_TARGET]: () => {
        draft.componentList = []
        draft.target = {
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
        }
        draft.componentList?.push(action.payload)
      },
      /* 设置组件列表，并根据当前选中的组件，设置其他组件为未选中 */
      [SET_COMPONENT_LIST]: () => {
        let newState = cloneDeep(action.payload?.newState)
        draft.componentList = newState
      },
      // 更新容器中的列表组件
      [UPDATE_COMPONENT_LIST_OF_ITEM_CHILDREN]: () => {
        const { id, children = [] } = action.payload || {}
        let _children = cloneDeep(children)
        draft?.componentList?.forEach((item, index) => {
          if (item.id === id) {
            item.children = _children
          }
        })
      },
      [DEL_COMPONENT_LIST]: () => {
        const findDelItem = (data: IFormComProp[]) => {
          for (let i = 0; i < data?.length; i++) {
            if (data[i]?.children) {
              findDelItem(draft.componentList[i].children as IFormComProp[])
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
        let newItem = {} as IFormComProp
        const { id, newId = shortid() } = action?.payload || {}
        const findCopyItem = (data: IFormComProp[]) => {
          data?.forEach((item, index) => {
            if (item?.children) {
              findCopyItem(item?.children)
            }
            if (item.id === id) {
              newItem = cloneDeep(item)
              newItem.id = newId
              newItem.key = newId
              newItem.formItemProps.name = newId
              data.push(newItem)
              draft.target = newItem
            }
          })
        }
        findCopyItem(draft?.componentList)
      },
      [INSERT_COMPONENT_LIST]: () => {
        const { index, data } = action.payload
        draft.componentList.splice(index, 0, data)
      },
      [UPDATE_COMPONENT_LIST_BY_TARGET]: () => {
        const { data = {} } = action.payload || {}
        const findCurrent = (coms: IFormComProp[]) => {
          coms?.forEach((item, index) => {
            if (item.id === draft.target?.id) {
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
      [UPDATE_COMPONENT_LIST_AND_TARGET]: () => {
        const { componentKey, newComponentProps } = action.payload || {}
        const componentList = draft?.componentList?.map((item) => {
          if (item.id === draft.target?.id) {
            item.componentKey = componentKey
            item.componentProps = {
              ...item.componentProps,
              ...newComponentProps,
            }
          }
          return item
        })
        draft.target.componentKey = componentKey
        draft.target.componentProps = newComponentProps
        draft.componentList = componentList
      },
      [SET_MOVEABLE_OPTIONS]: () => {
        draft.moveableOptions = merge(
          draft.moveableOptions,
          cloneDeep(action.payload)
        )
      },
      // 重置layout属性
      [RESET_COMPONENT_LAYOUT]: () => {
        const { colNum, gutter } = action.payload || {}
        draft.componentList.forEach((item, index) => {
          const layout = {
            frame: { translate: [0, 0, 0] },
          } as any
          if (colNum > 1) {
            layout.width = `calc(100% / ${colNum})`
            // 兼容gutter
            if (gutter > 0) {
              const margin = ((colNum - 1) * gutter) / colNum
              layout.width = `calc(100%/${colNum} - ${
                isInteger(margin) ? margin : margin.toFixed(2)
              }px)`
              // 调整除每行第一个的位置
              if (index !== 0 && index % colNum !== 0) {
                // 当前所在列数(从0开始)
                const tarColNum = index % colNum
                layout.frame.translate[0] =
                  layout.frame.translate[0] + gutter * tarColNum
              }
            }
          }
          item.layout = layout
        })
      },
    }

    if (typeof strategy[action.type] === 'function') {
      // console.table({
      //   [action.type]: strategy[action.type](),
      //   payload: action.payload,
      // });
      strategy[action.type]()
    }
  }
)
