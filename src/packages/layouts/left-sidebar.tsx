import React, { forwardRef, useState } from "react";
import { Button, Col, Row } from "antd";
import { IconFont, options } from "../constants";
import { OptionGroup, OptionItem } from "../typings/option";
import { ReactSortable } from "react-sortablejs";
import * as uuid from "uuid";
import { hasNotPlaceholder, isRowComponent, isSelect } from '../utils/utils'
import { FormComProp } from "../stores/typings";
import { GLOBAL_STATE } from "../stores/state";

const getNewOptions = (data: OptionGroup[]) => {
  return data.map((item) => {
    return {
      ...item,
      children: item?.children?.map((cItem) => {
        const { value, label, icon } = cItem || {};
        const id = uuid.v4();
        const ret: FormComProp & OptionItem = {
          value,
          label,
          icon,
          id,
          key: id,
          chosen: true,
          componentKey: value,
          formItemProps: {
            name: id,
            label,
            labelCol: {
              span: 3,
            },
            wrapperCol: {
              span: 24,
            },
          },
          colProps: {
            span: isRowComponent(value) ? 12 : 24,
          },
          componentProps: {},
        }
        if (!hasNotPlaceholder(value)) {
          const placeholderEnum: any = {
            'TimePicker.RangePicker': ['开始时间', '结束时间'],
            'DatePicker.RangePicker': ['开始日期', '结束日期'],
          }
          if (isSelect(value)) {
            ret.componentProps.placeholder = placeholderEnum[value] || ('请选择' + label)
          } else {
            ret.componentProps.placeholder = '请输入' + label
          }
        }
        return ret
      }),
    };
  });
};

const CustomRow = forwardRef<HTMLDivElement, any>((props, ref) => {
  return (
    <Row ref={ref} gutter={[6, 6]} style={{ padding: "0 12px 12px 12px" }}>
      {props.children}
    </Row>
  );
});

const initOptions = getNewOptions(options);
export default () => {
  const [_options, setOptions] = useState(initOptions);

  const onFocus = (childItem: any) => {
    GLOBAL_STATE.currentDragComponent = childItem
  }

  const generator = (data: any[]) => {
    return data.map((item) => {
      return (
        <div key={item.key}>
          <Button
            className="title-btn"
            style={{ paddingLeft: 12 }}
            icon={<IconFont type={item.icon} />}
            type="text"
            disabled
          >
            {item.label}
          </Button>
          <ReactSortable
            group={{
              name: "editor-area",
              pull: "clone",
              put: false,
              revertClone: true,
            }}
            sort={false}
            tag={CustomRow}
            list={item.children}
            setList={(newState) => {}}
            animation={200}
            delayOnTouchOnly
            onEnd={() => {
              setOptions(getNewOptions(_options));
            }}
          >
            {item.children &&
              item.children.map((childItem: any) => {
                return (
                  <Col span={12} key={childItem.value}>
                    <Button
                      block
                      style={{ backgroundColor: "#f8f8f8", fontSize: "12px" }}
                      type="default"
                      icon={<IconFont type={childItem.icon} />}
                      onFocus={() => onFocus(childItem)}
                    >
                      {childItem.label}
                    </Button>
                  </Col>
                );
              })}
          </ReactSortable>
        </div>
      );
    });
  };

  return <>{generator(_options)}</>;
};
