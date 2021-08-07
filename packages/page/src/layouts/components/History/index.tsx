import React, { useEffect, useState } from 'react'
import { IndexedDB } from '@r-generator/shared'
import { List, Typography } from 'antd'
import { HistoryOutlined } from '@ant-design/icons'

export default function History() {
  const [list, setList] = useState<any[]>([])

  useEffect(() => {
    const indexedDB = new IndexedDB()
    indexedDB.readAll().then((res) => {
      setList(res)
    })
  }, [])

  return (
    <List
      header={
        <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 0 }}>
          <HistoryOutlined style={{ marginRight: 5 }} />
          History
        </Typography.Title>
      }
      dataSource={list}
      renderItem={(item) => (
        <List.Item>
          {/* <Typography.Text mark>[ITEM]</Typography.Text>  */}
          {item.id}
        </List.Item>
      )}
    />
  )
}
