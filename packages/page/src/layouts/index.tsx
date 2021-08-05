import React, { useEffect, useState } from 'react'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import LeftAction from './LeftAction'
import RightAction from './RightAction'
import { Moveable, InfiniteViewer } from '../components'
import FormDesignArea from './components/AssembleArea'
import DesignArea from './components/DrawArea'
import { useStore } from '@r-generator/stores'
import './index.less'

import { resetViewport } from '../utils/utils'

export type BtnTypes =
  | ''
  | 'form-pool'
  | 'base-pool'
  | 'chart-pool'
  | 'swtich'
  | 'run'
  | 'clean'
  | 'copy'
  | 'download'
  | 'setting'
  | 'preview'
  | 'center'

export default () => {
  const { mode } = useStore()
  const [type, setType] = useState<BtnTypes>('form-pool')

  const handleType = (val: BtnTypes) => {
    if (type === val) {
      setType('')
    } else {
      setType(val)
    }
  }

  useEffect(() => {
    if (['form-pool', 'setting', ''].includes(type)) {
      resetViewport()
    }
  }, [type])

  return (
    <div className="container">
      <LeftAction type={type} handleType={handleType} />
      <LeftSidebar type={type} />
      <div className="content">
        {mode === 'assemble' ? (
          <FormDesignArea />
        ) : (
          <InfiniteViewer>
            <DesignArea />
            <Moveable />
          </InfiniteViewer>
        )}
      </div>
      <RightSidebar type={type} />
      <RightAction type={type} handleType={handleType} />
    </div>
  )
}
