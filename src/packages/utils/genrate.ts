import { ComponentKeys, FormComProp } from "../stores/typings";

function generateProps(props: { [key: string]: any }, result = "") {
  Object.keys(props).forEach((key) => {
    const value = JSON.stringify(props[key]);
    if (typeof value !== "undefined") {
      result += ` ${key}={${value}}`;
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
      result += ` ${key}={${value}}`;
    }
  });
  return result;
}

function createCol(data: FormComProp[] | undefined, result = "") {
  data?.forEach((cItem: any) => {
    result += createFormItem(cItem);
  });
  return result;
}

function createFormItem(item: FormComProp): string {
  const { formItemProps, componentProps, componentKey, colProps } = item;
  const colPropsStr = generateProps(colProps);
  const formItemPropsStr = generateProps(formItemProps);
  const componentPropsStr = generateComProps(componentProps, componentKey);
  return `<Col${colPropsStr}>
  ${
    componentKey === "Col"
      ? `<Row>
        ${createCol(item?.children)}  
      </Row>`
      : `<Form.Item${formItemPropsStr}>
        <${componentKey}${componentPropsStr} />
    </Form.Item>`
  }
    </Col>`;
}

function generate(componentList: FormComProp[]) {
  let ret = "";
  const initialValues = {} as any;
  componentList.forEach((item) => {
    ret += createFormItem(item);
    if (item.componentProps?.defaultValue && item.formItemProps?.name) {
      initialValues[item.formItemProps.name] =
        item.componentProps?.defaultValue;
    }
  });
  let initialValuesStr = Object.keys(initialValues).length
    ? `initialValues={${JSON.stringify(initialValues)}}`
    : "";
  return `<Form ${initialValuesStr}>
        <Row>${ret}</Row>
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
 */
function generateImport(componentList: FormComProp[]) {
  const keys = getAllComponentKey(componentList);
  // 引用
  let comImport = Array.from(
    new Set(keys.filter((item) => item.indexOf(".") === -1))
  );
  // 嵌套引用
  const childImport = keys?.filter((item) => item.indexOf(".") !== -1);
  const uniqueChildKeys = new Set(childImport);
  const childImportList = [] as string[];
  uniqueChildKeys.forEach((item) => {
    const [parent, child] = item?.split('.') || []
    childImportList.push(`const {${child}} = ${parent};\n`);
  });
  const importReact = `import React from "react";\n`;
  const importAntd = `import {${[comImport]}} from 'antd';\n`;
  return importReact + importAntd + childImportList?.toString()?.replace(',', '');
}

export { generate, generateImport };
