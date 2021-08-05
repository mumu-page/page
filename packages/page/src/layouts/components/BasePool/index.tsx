import React, { useState } from 'react'
import { RenderPool } from '../../../components'

export default function FormPool() {
  const [list, setList] = useState([])

  return <RenderPool title='基础组件' list={list} setList={setList} />
}
