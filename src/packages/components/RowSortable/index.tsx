import React, { memo } from 'react'
import { Col, Row } from 'antd'
import { ReactSortable } from 'react-sortablejs'
import { isEqual } from 'lodash'

interface RowSortableProp {
  children: { id: string; [key: string]: any }[]
}
export default memo(
  (props: RowSortableProp) => {
    const { children = [] } = props

    return (
      <Row className="row-wrap">
        <ReactSortable
          group={{
            name: 'editor-area',
            put: true,
          }}
          list={children}
          setList={(newState) => {}}
          animation={200}
          delayOnTouchOnly
        >
          {children?.map((item) => {
            return <Col>www</Col>
          })}
        </ReactSortable>
      </Row>
    )
  },
  (prevProps: any, nextProps: any) => {
    return isEqual(prevProps, nextProps)
  }
)
