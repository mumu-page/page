import React, { useState } from 'react'
import { Form, Input, InputNumber, Radio, Slider, Switch } from 'antd'

type SizeType = Parameters<typeof Form>[0]['size']
const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
}
export default function () {
  const [componentSize, setComponentSize] = useState<SizeType | 'default'>(
    'default'
  )
  const onFormLayoutChange = ({
    size,
  }: {
    size: SizeType
    labelAlign: 'left' | 'right'
  }) => {
    setComponentSize(size)
  }
  return (
    <Form
      {...layout}
      initialValues={{
        align: 'top',
        gutter: 0,
        justify: 'start',
        wrap: true,
      }}
      onValuesChange={onFormLayoutChange}
    >
      <Form.Item label="垂直对齐方式" name="align">
        <Radio.Group>
          <Radio.Button value="top">top</Radio.Button>
          <Radio.Button value="middle">middle</Radio.Button>
          <Radio.Button value="bottom">bottom</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="水平排列方式" name="justify">
        <Radio.Group>
          <Radio value="start">start</Radio>
          <Radio value="middle">end</Radio>
          <Radio value="center">center</Radio>
          <Radio value="space-around">space-around</Radio>
          <Radio value="space-between">space-between</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="自动换行" name="wrap" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item label="栅格间隔" name="gutter">
        <Slider
          marks={{ 0: '0', 24: '24', 48: '48', 72: '72', 100: '100' }}
          min={0}
          max={100}
        />
      </Form.Item>
      <Form.Item label="栅格数(span)" name="span">
        <Slider marks={{ 0: '0', 12: '12', 24: '24' }} min={0} max={24} />
      </Form.Item>
      <Form.Item label="栅格数(xs)" name="xs">
        <Slider marks={{ 0: '0', 12: '12', 24: '24' }} min={0} max={24} />
      </Form.Item>
      <Form.Item label="栅格数(sm)" name="sm">
        <Slider marks={{ 0: '0', 12: '12', 24: '24' }} min={0} max={24} />
      </Form.Item>
      <Form.Item label="栅格数(md)" name="md">
        <Slider marks={{ 0: '0', 12: '12', 24: '24' }} min={0} max={24} />
      </Form.Item>
      <Form.Item label="栅格数(lg)" name="lg">
        <Slider marks={{ 0: '0', 12: '12', 24: '24' }} min={0} max={24} />
      </Form.Item>
      <Form.Item label="栅格数(xl)" name="xl">
        <Slider marks={{ 0: '0', 12: '12', 24: '24' }} min={0} max={24} />
      </Form.Item>
      <Form.Item label="栅格数(xxl)" name="xxl">
        <Slider marks={{ 0: '0', 12: '12', 24: '24' }} min={0} max={24} />
      </Form.Item>
    </Form>
  )
}
