import React, { useEffect, useState } from 'react'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import LeftAction from './LeftAction'
import RightAction from './RightAction'
import { ReactiveMoveable, InfiniteViewer } from '../../components'
import FormDesignArea from '../AssembleArea'
import DesignArea from '../DrawArea'
import { useStore } from '@r-generator/stores'
import './index.less'

import { resetViewport } from '../../utils/utils'

export type BtnTypes =
  | 'coms'
  | ''
  | 'run'
  | 'clean'
  | 'copy'
  | 'download'
  | 'setting'
  | 'preview'
  | 'center'

export default (props: any) => {
  const { mode } = useStore()
  const [type, setType] = useState<BtnTypes>('coms')

  const handleType = (val: BtnTypes) => {
    if (type === val) {
      setType('')
    } else {
      setType(val)
    }
  }

  useEffect(() => {
    if (['coms', 'setting', ''].includes(type)) {
      resetViewport()
    }
  }, [type])

  return (
    <div className="container">
      <LeftAction type={type} handleType={handleType} />
      {type === 'coms' && <LeftSidebar />}
      <div className="content">
        {mode === 'assemble' ? (
          <FormDesignArea />
        ) : (
          <InfiniteViewer>
            <DesignArea />
            <ReactiveMoveable />
          </InfiniteViewer>
        )}
      </div>
      {type === 'setting' && <RightSidebar />}
      <RightAction type={type} handleType={handleType} />
    </div>
  )
}
