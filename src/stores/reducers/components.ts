import { cloneDeep, isInteger, merge } from "lodash";
import { shortid } from '../../utils/utils'
import {
  SET_COMPONENT_LIST,
  DEL_COMPONENT_LIST,
  COPY_COMPONENT_LIST,
  INSERT_COMPONENT_LIST,
  UPDATE_COMPONENT_LIST_BY_TARGET,
  UPDATE_COMPONENT_LIST_AND_TARGET,
  DELETE_ALL_COMPONENT_LIST_AND_TARGET,
  UPDATE_COMPONENT_LIST_OF_ITEM_CHILDREN,
  PUT_COMPONENT_LIST,
  RESET_COMPONENT_LAYOUT,
  SET_COMPONENT_LAYOUT,
  RIGHT_REMOVE_COMPONENTS,
  LEFT_REMOVE_COMPONENTS,
} from "../action-type";
import { ICommonState, IFormComProp } from "../typings";

export default (
  draft: ICommonState,
  action: { type: string; payload?: any }
) => ({
  // 清空控件列表和当前拖拽控件数据
  [DELETE_ALL_COMPONENT_LIST_AND_TARGET]: () => {
    draft.componentList = [];
    draft.target = {
      id: "",
      componentKey: "",
      formItemProps: {},
      componentProps: {},
      colProps: {},
      rowProps: {},
    };
  },
  [PUT_COMPONENT_LIST]: () => {
    for (let i = 0; i < draft.componentList?.length; i++) {
      const item = draft.componentList[i];
      if (item.id === action.payload?.id) {
        return;
      }
    }
    draft.componentList?.push(action.payload);
  },
  /* 设置组件列表，并根据当前选中的组件，设置其他组件为未选中 */
  [SET_COMPONENT_LIST]: () => {
    let newState = cloneDeep(action.payload?.newState);
    draft.componentList = newState;
  },
  // 更新容器中的列表组件
  [UPDATE_COMPONENT_LIST_OF_ITEM_CHILDREN]: () => {
    const { id, children = [] } = action.payload || {};
    let _children = cloneDeep(children);
    draft?.componentList?.forEach((item, index) => {
      if (item.id === id) {
        item.children = _children;
      }
    });
  },
  [DEL_COMPONENT_LIST]: () => {
    const findDelItem = (data: IFormComProp[]) => {
      for (let i = 0; i < data?.length; i++) {
        if (data[i]?.children) {
          findDelItem(draft.componentList[i].children as IFormComProp[]);
        }
        if (data[i].id === action.payload?.id) {
          data.splice(i, 1);
          break;
        }
      }
    };
    findDelItem(draft?.componentList);
  },
  [COPY_COMPONENT_LIST]: () => {
    let newItem = {} as IFormComProp;
    const { id, newId = shortid() } = action?.payload || {};
    const findCopyItem = (data: IFormComProp[]) => {
      data?.forEach((item, index) => {
        if (item?.children) {
          findCopyItem(item?.children);
        }
        if (item.id === id) {
          newItem = cloneDeep(item);
          newItem.id = newId;
          newItem.key = newId;
          newItem.formItemProps.name = newId;
          data.push(newItem);
          draft.target = newItem;
        }
      });
    };
    findCopyItem(draft?.componentList);
  },
  [INSERT_COMPONENT_LIST]: () => {
    const { index, data } = action.payload;
    draft.componentList.splice(index, 0, data);
  },
  [UPDATE_COMPONENT_LIST_BY_TARGET]: () => {
    const { data = {} } = action.payload || {};
    const findCurrent = (coms: IFormComProp[]) => {
      coms?.forEach((item, index) => {
        if (item.id === draft.target?.id) {
          if (data.componentProps?.options && item?.componentProps?.options) {
            item.componentProps.options = [];
          }
          if (
            data.componentProps?.style?.width === null &&
            item?.componentProps?.style
          ) {
            data.componentProps.style = null;
            item.componentProps.style = null;
          }
          item = merge(item, data);
        }
        if (item?.children) {
          findCurrent(item.children);
        }
      });
    };
    findCurrent(draft?.componentList);
  },
  // 同时更新当前选中控件和设计区控件列表
  [UPDATE_COMPONENT_LIST_AND_TARGET]: () => {
    const { componentKey, newComponentProps } = action.payload || {};
    const componentList = draft?.componentList?.map((item) => {
      if (item.id === draft.target?.id) {
        item.componentKey = componentKey;
        item.componentProps = {
          ...item.componentProps,
          ...newComponentProps,
        };
      }
      return item;
    });
    draft.target.componentKey = componentKey;
    draft.target.componentProps = newComponentProps;
    draft.componentList = componentList;
  },
  // 重置layout属性
  [RESET_COMPONENT_LAYOUT]: () => {
    draft.componentList.forEach((item, index) => {
      item.layout = {};
    });
  },
  // 根据列数重新计算layout属性
  [SET_COMPONENT_LAYOUT]: () => {
    const { colNum, gutter } = action.payload || {};
    draft.componentList.forEach((item, index) => {
      const layout = {
        frame: { translate: [0, 0, 0] },
      } as any;
      if (colNum > 1) {
        layout.width = `calc(100% / ${colNum})`;
        // 兼容gutter
        if (gutter > 0) {
          const margin = ((colNum - 1) * gutter) / colNum;
          layout.width = `calc(100%/${colNum} - ${
            isInteger(margin) ? margin : margin.toFixed(2)
          }px)`;
          // 调整除每行第一个的位置
          if (index !== 0 && index % colNum !== 0) {
            // 当前所在列数(从0开始)
            const tarColNum = index % colNum;
            layout.frame.translate[0] =
              layout.frame.translate[0] + gutter * tarColNum;
          }
        }
      }
      item.layout = layout;
    });
  },
  [LEFT_REMOVE_COMPONENTS]: () => {
    const { id } = action.payload || {};
    const findIndex = draft.componentList.findIndex((item) => {
      return item.id === id;
    });
    const target = draft.componentList[findIndex];
    const preIdx = findIndex - 1;
    if (preIdx > 0) {
      const preItem = draft.componentList[preIdx];
      draft.componentList[preIdx] = target;
      draft.componentList[findIndex] = preItem;
    }
  },
  [RIGHT_REMOVE_COMPONENTS]: () => {
    const { id } = action.payload || {};
    const findIndex = draft.componentList.findIndex((item) => {
      return item.id === id;
    });
    const target = draft.componentList[findIndex];
    const nextIdx = findIndex + 1;
    if (nextIdx < draft.componentList.length) {
      const nextItem = draft.componentList[nextIdx];
      draft.componentList[nextIdx] = target;
      draft.componentList[findIndex] = nextItem;
    }
  },
});
