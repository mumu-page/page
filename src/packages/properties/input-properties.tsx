import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Form,
  Input,
  InputNumber,
  Radio,
  Switch,
  Button,
  Divider,
  Typography,
  Collapse,
  Checkbox,
  Tooltip,
} from "antd";
import { Context } from "../stores/context";
import {
  UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
  SET_CURRENT_DRAG_COMPONENT,
} from "../stores/action-type";
import { debounce } from "lodash";
import { CaretRightOutlined, SelectOutlined } from "@ant-design/icons";
import { IconModal, IconModalInstanceProp } from "../components";
import { FORM_PROPERTIES_OPTIONS } from "../constants/constants";

let shouldUpdate = true;
export default () => {
  const [form] = Form.useForm();
  const iconModal = useRef<IconModalInstanceProp>(null);
  const { currentDragComponent, commonDispatch } = useContext(Context);
  const { id, componentProps = {} } = currentDragComponent || {};
  const [iconType, setIconType] = useState<"prefix" | "suffix">("prefix");

  const onValuesChange = (changedValues: any, allValues: any) => {
    shouldUpdate = false;
    commonDispatch({
      type: SET_CURRENT_DRAG_COMPONENT,
      payload: {
        id,
        componentProps: {
          defaultValue: allValues?.defaultValue,
        },
      },
    });
    commonDispatch({
      type: UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
      payload: {
        id,
        data: {
          componentProps: allValues,
        },
      },
    });
  };

  const setPrefix = () => {
    iconModal.current?.show();
    setIconType("prefix");
  };

  const setSuffix = () => {
    iconModal.current?.show();
    setIconType("suffix");
  };

  const onOk = (iconKey: string, Icon: React.ReactElement) => {
    commonDispatch({
      type: SET_CURRENT_DRAG_COMPONENT,
      payload: {
        id,
        componentProps: {
          [iconType]: iconKey,
        },
      },
    });
    commonDispatch({
      type: UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
      payload: {
        id,
        data: {
          componentProps: {
            [iconType]: iconKey,
          },
        },
      },
    });
  };

  useEffect(() => {
    if (!shouldUpdate) return;
    form.resetFields();
    form.setFieldsValue(componentProps);
  }, [componentProps, currentDragComponent, form]);

  return (
    <>
      <IconModal ref={iconModal} onOk={onOk} />
      <Form
        {...FORM_PROPERTIES_OPTIONS}
        initialValues={{
          bordered: true,
          disabled: false,
          size: "middle",
        }}
        form={form}
        onValuesChange={onValuesChange}
      >
        <Collapse
          defaultActiveKey={["输入框属性"]}
          className="site-collapse-custom-collapse"
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
        >
          <Collapse.Panel
            header="输入框属性"
            key="输入框属性"
            className="site-collapse-custom-panel"
          >
            <Form.Item label="默认值" name="defaultValue">
              <Input
                onBlur={() => (shouldUpdate = true)}
                onPressEnter={() => (shouldUpdate = true)}
              />
            </Form.Item>
            <Form.Item
              label="前置标签"
              tooltip="带标签的 input，设置前置标签"
              name="addonBefore"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="后置标签"
              tooltip="带标签的 input，设置后置标签"
              name="addonAfter"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="前缀图标"
              tooltip="带有前缀图标的 input"
              name="prefix"
            >
              <Input
                readOnly
                addonAfter={
                  <Button
                    onClick={setPrefix}
                    size="small"
                    type="link"
                    style={{ fontSize: 12, height: 20 }}
                    icon={<SelectOutlined />}
                  >
                    选择
                  </Button>
                }
              />
            </Form.Item>
            <Form.Item
              label="后缀图标"
              tooltip="带有后缀图标的 input"
              name="suffix"
            >
              <Input
                readOnly
                addonAfter={
                  <Button
                    onClick={setSuffix}
                    size="small"
                    type="link"
                    style={{ fontSize: 12, height: 20 }}
                    icon={<SelectOutlined />}
                  >
                    选择
                  </Button>
                }
              />
            </Form.Item>
            <Form.Item label="最大长度" name="maxLength">
              <InputNumber />
            </Form.Item>
            <Form.Item
              label="控件大小"
              tooltip="注：标准表单内的输入框大小限制为 large"
              name="size"
            >
              <Radio.Group>
                <Radio.Button value="large">较大</Radio.Button>
                <Radio.Button value="middle">中等</Radio.Button>
                <Radio.Button value="small">迷你</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="" valuePropName="checked" name="allowClear">
              <Checkbox>
                <Tooltip title="可以点击清除图标删除内容">支持清除</Tooltip>
              </Checkbox>
            </Form.Item>
            <Form.Item label="" valuePropName="checked" name="bordered">
              <Checkbox>
                <Tooltip title="是否有边框">显示边框</Tooltip>
              </Checkbox>
            </Form.Item>
            <Form.Item label="" valuePropName="checked" name="disabled">
              <Checkbox>
                <Tooltip title="是否禁用状态，默认为 false">禁用</Tooltip>
              </Checkbox>
            </Form.Item>
          </Collapse.Panel>
        </Collapse>
      </Form>
    </>
  );
};
