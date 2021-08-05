import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { Modal, Row, Col, Input, Button } from 'antd'
import { ICON_ENTRIES } from '../../properties/antd/constants'
import { SearchOutlined } from '@ant-design/icons'
import { IconModalProp, IconModalInstanceProp } from './typings'
import './index.less'

export default forwardRef(
  (
    props: IconModalProp,
    ref:
      | ((instance: IconModalInstanceProp) => void)
      | React.MutableRefObject<unknown>
      | null
  ) => {
    const { onOk } = props
    const [isModalVisible, setModalVisible] = useState(false)
    const [icons, setIcons] =
      useState<[key: string, value: any][]>(ICON_ENTRIES)

    const handleClick = (iconKey: string, Icon: any) => {
      setModalVisible(false)
      onOk && onOk(iconKey, <Icon />)
    }
    const handleCancel = () => {
      setModalVisible(false)
    }

    const onSearch = (e: any) => {
      const value = e.target.value
      const newIcons = ICON_ENTRIES.filter((option) => {
        const [iconKey] = (option || []) as any
        return iconKey?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1
      })
      setIcons(newIcons)
    }

    useImperativeHandle(
      ref,
      () => ({
        show() {
          setModalVisible(true)
        },
        hide() {
          setModalVisible(false)
        },
      }),
      []
    )

    return (
      <Modal
        width="80%"
        title={
          <div className="modal-title">
            <span>Ant Design Icon 图标</span>
            <Input
              className="search"
              onInput={onSearch}
              placeholder="在此搜索图标，点击图标可选中"
              addonAfter={
                <Button
                  type="link"
                  size="small"
                  icon={<SearchOutlined />}
                ></Button>
              }
            />
          </div>
        }
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
      >
        <Row gutter={[16, 16]}>
          {icons?.map((option) => {
            const [iconKey, Icon] = (option || []) as any
            return (
              <Col
                className="icon-col"
                span={3}
                key={iconKey}
                onClick={() => {
                  handleClick(iconKey, Icon)
                }}
              >
                <div className="icon-item">
                  {typeof Icon !== 'function' ? (
                    React.cloneElement(<Icon />)
                  ) : (
                    <></>
                  )}
                </div>
                <div>{iconKey}</div>
              </Col>
            )
          })}
        </Row>
      </Modal>
    )
  }
)
