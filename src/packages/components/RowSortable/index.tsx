import React, { memo, useContext } from "react";
import { Col, Row } from "antd";
import { ReactSortable } from "react-sortablejs";
import { isEqual } from "lodash";
import { FormComProp } from "../../stores/typings";
import SortableItem from "../SortableItem";
import { Context } from "../../stores/context";
import { UPDATE_COMPONENT_LIST_OF_ITEM_CHILDREN } from "../../stores/action-type";

export interface RowSortableProp {
  id?: string; // 父ID
  children?: FormComProp[];
}
export default memo(
  (props: RowSortableProp) => {
    const { id, children = [] } = props;
    const {  commonDispatch } = useContext(Context);

    return (
      <Row className="row-wrap">
        <ReactSortable
          group={{
            name: "editor-area",
            put: true,
          }}
          style={{
            minHeight: "100%",
            minWidth: "100%",
          }}
          list={children}
          setList={(newState) => {
            commonDispatch({
              type: UPDATE_COMPONENT_LIST_OF_ITEM_CHILDREN,
              payload: {
                id,
                children: newState,
              },
            });
          }}
          animation={200}
          delayOnTouchOnly
        >
          {children?.map((item) => {
            const {
              id,
              componentKey,
              formItemProps,
              componentProps,
              colProps = {},
            } = item;

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
            );
          })}
        </ReactSortable>
      </Row>
    );
  },
  (prevProps: any, nextProps: any) => {
    return isEqual(prevProps, nextProps);
  }
);
