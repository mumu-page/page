import React, { memo, useContext } from 'react'
import { Col, Row, message } from "antd";
import { ReactSortable } from 'react-sortablejs'
import { isEqual } from 'lodash'
import { FormComProp } from '../../stores/typings'
import SortableItem from '../SortableItem'
import { Context } from '../../stores/context'
import {
  SET_CURRENT_DRAG_COMPONENT,
  SET_CURRENT_DRAG_COMPONENT_BY_COMPONENT_LIST,
  UPDATE_COMPONENT_LIST_OF_ITEM_CHILDREN,
} from '../../stores/action-type'
import { GLOBAL_STATE } from '../../stores/state'
import { canChosen, canAddCol } from "../../layouts/EditorArea/data";
import './index.scss'

export interface RowSortableProp {
  id?: string // 父ID
  children?: FormComProp[]
}
export default memo(
  (props: RowSortableProp) => {
    const { id, children = [] } = props
    const { commonDispatch } = useContext(Context)

    return (
      <Row className="row-wrap">
        <ReactSortable
          group={{
            name: 'editor-area',
            put: true,
          }}
          style={{
            minHeight: '100%',
            minWidth: '100%',
          }}
          list={children}
          animation={200}
          delayOnTouchOnly
          setList={(newState) => {
            if (newState?.find((item) => item.componentKey === "Col")) {
              message.info("不能嵌套添加行容器");
              canAddCol.set(false);
              return;
            }
            canAddCol.set(true);
            commonDispatch({
              type: UPDATE_COMPONENT_LIST_OF_ITEM_CHILDREN,
              payload: {
                id,
                children: newState,
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
            e.stopPropagation()
            if (!canChosen.value) return
            // FIX: 修复已选中，再次选中则样式丢失
            e.item.classList.add('sortable-chosen')
            GLOBAL_STATE.currentDragComponent.id = e.item.dataset?.id || ''
            commonDispatch({
              type: SET_CURRENT_DRAG_COMPONENT_BY_COMPONENT_LIST,
              payload: { id: GLOBAL_STATE.currentDragComponent.id },
            })
          }}
        >
          {children?.map((item) => {
            const {
              id,
              componentKey,
              formItemProps,
              componentProps,
              colProps = {},
            } = item

            return (
              <Col key={item.id} {...colProps} className="editor-area-item-col">
                <SortableItem
                  id={id}
                  key={id}
                  colProps={colProps}
                  formItemProps={formItemProps}
                  componentProps={componentProps}
                  componentKey={componentKey}
                />
              </Col>
            )
          })}
        </ReactSortable>
      </Row>
    )
  },
  (prevProps: any, nextProps: any) => {
    return isEqual(prevProps, nextProps)
  }
)
