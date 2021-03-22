import { ComponentKeys, FormComProp } from "../stores/typings";
import { isSelect } from "./utils";

function parseProp(key: string, value: any, result = "") {
  if (!value) return "";
  try {
    result = JSON.parse(value);
    if (result !== null && ["object", "number"].includes(typeof result)) {
      result = ` ${key}={${value}}`;
    } else if (typeof result === "boolean") {
      if (result === true) {
        result = ` ${key}`;
      } else {
        result = ` ${key}={${value}}`;
      }
    } else if (typeof result === "string") {
      result = ` ${key}=${value}`;
    }
  } catch (e) {
    if (value?.indexOf("<") !== -1) {
      result = ` ${key}={${value}}`;
    } else {
      result = "";
    }
  }
  return result;
}

function generateProps(props: { [key: string]: any }, result = "") {
  Object.keys(props).forEach((key) => {
    const value = JSON.stringify(props[key]);
    if (typeof value != "undefined" && !["null", "undefined"].includes(value)) {
      result += `${parseProp(key, value)}`;
    }
  });
  return result;
}

function generateComProps(
  componentProps: { [key: string]: any },
  componentKey: ComponentKeys,
  result = ""
) {
  const { defaultValue, ...componentOtherProps } = componentProps;
  const componentPropsKey = Object.keys(componentOtherProps);
  // 处理输入框前后置图标
  if (["Input"].includes(componentKey)) {
    if (componentPropsKey.includes("prefix")) {
      const IconComponent = componentOtherProps["prefix"] || "React.Fragment";
      componentOtherProps["prefix"] = `<${IconComponent} />`;
    }
    if (componentPropsKey.includes("suffix")) {
      const IconComponent = componentOtherProps["suffix"] || "React.Fragment";
      componentOtherProps["suffix"] = `<${IconComponent} />`;
    }
  }
  // 控件参数
  componentPropsKey.forEach((key) => {
    let value = JSON.stringify(componentOtherProps[key]);
    // 处理输入框前后缀标签
    if (["prefix", "suffix"].includes(key)) {
      value = value?.replace(/"/g, "");
    }
    if (typeof value !== "undefined") {
      result += `${parseProp(key, value)}`;
    }
  });
  return result;
}

function createFormItem(
  item: FormComProp,
  currentDragComponent: FormComProp
): string {
  const {
    formItemProps,
    componentProps,
    componentKey,
    colProps = {},
    layout = {},
  } = item;
  const { rowProps = {}, formProps = {} } = currentDragComponent;
  const {
    colNum,
    gutter,
    align,
    justify,
    wrap,
    ...otherGlobalProps
  } = rowProps;
  const { labelCol, wrapperCol } = formProps;
  const { colNum: _colNum, ...otherColProps } = colProps;
  /**样式开始 */
  const { frame = { translate: [0, 0, 0] }, height, width } = layout;
  const { translate } = frame;
  const style = {} as any;
  // 排除不需要添加transform的样式
  if (
    translate[0] !== rowProps.gutter &&
    translate[0] !== 0 &&
    translate[1] !== 0
  ) {
    let translateX = translate[0];
    if (rowProps.gutter > 0 && translate[0] !== 0) {
      translateX = translate[0] - rowProps.gutter;
    }
    style.transform = `translate(${translateX}px, ${translate[1]}px)`;
  }
  if (width) {
    style.width = `${width}px`;
  }
  if (height) {
    style.height = `${height}px`;
  }
  /**样式结束 */
  const colPropsStr = generateProps({ ...otherColProps, ...otherGlobalProps });
  const formItemPropsStr = generateProps({
    ...formItemProps,
    labelCol,
    wrapperCol,
  });
  const componentPropsStr = generateComProps(componentProps, componentKey);
  const componentName = componentKey?.replace(/^.*\./, "");
  return `<Col${colPropsStr}>
           <Form.Item${formItemPropsStr} style={${JSON.stringify(style)}}>
                <${componentName}${componentPropsStr}></${componentName}>
            </Form.Item>
        </Col>\n`;
}

function generate(
  componentList: FormComProp[],
  currentDragComponent: FormComProp
) {
  let ret = "";
  const initialValues = {} as any;
  componentList.forEach((item) => {
    ret += createFormItem(item, currentDragComponent);
    if (item.componentProps?.defaultValue && item.formItemProps?.name) {
      initialValues[item.formItemProps.name] =
        item.componentProps?.defaultValue;
    }
  });
  const { rowProps = {} } = currentDragComponent;
  const { gutter, align, justify, wrap } = rowProps;
  const rowPropsStr = generateProps({ gutter, align, justify, wrap });
  const initialValuesStr = Object.keys(initialValues).length
    ? ` initialValues={${JSON.stringify(initialValues)}}`
    : "";
  return `<Form${initialValuesStr}>
        <Row${rowPropsStr}>
          ${ret}
        </Row>
    </Form>`;
}

/**
 * 寻找所有使用到的组件Key
 */
function getAllComponentKey(
  componentList: FormComProp[],
  keys = [] as string[]
) {
  componentList?.forEach((item) => {
    keys.push(item.componentKey);
    if (item?.children) {
      getAllComponentKey(item?.children, keys);
    }
  });
  keys.push("Form");
  return keys;
}

/**
 * 生成引用代码
 * TODO: 生成ICON引用代码
 */
function generateImport(componentList: FormComProp[]) {
  const keys = getAllComponentKey(componentList, []);
  const childImport = {} as any;
  const parentImport = Array.from(
    new Set(
      keys.map((item) => {
        const [parent, child] = item.split(".");

        if (child) {
          if (childImport[parent]) {
            childImport[parent].push(child);
          } else {
            childImport[parent] = [child];
          }
        }
        return parent;
      })
    )
  );
  parentImport.push("Row");
  parentImport.push("Col");

  const importReact = `import React from "react"\n`;
  const importAntd = `import {${[parentImport]}} from 'antd'\n`;
  let importAntdChild = "";
  Object.keys(childImport).forEach((key) => {
    const item = childImport[key];
    if (item.length) {
      importAntdChild += `const {${item}} = ${key}\n`;
    }
  });
  if (importAntdChild) {
    return importReact + importAntd + "\n" + importAntdChild;
  }
  return importReact + importAntd;
}

export { generate, generateImport };
