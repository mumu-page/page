import React, { memo } from "react";
import { Col, Row } from "antd";
import { ReactSortable } from "react-sortablejs";
import { isEqual } from "lodash";
import { FormComProp } from "../../stores/typings";
import SortableItem from "../SortableItem";

export interface RowSortableProp {
  children?: FormComProp[];
}
export default memo(
  (props: RowSortableProp) => {
    const { children = [] } = props;

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
          setList={(newState) => {}}
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
