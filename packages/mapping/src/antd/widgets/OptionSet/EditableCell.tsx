import React, { useState, useRef } from 'react'
import { Input } from 'antd'
import './EditableCell.less'

export default (props: any) => {
  const { children, onChange } = props
  const [visiable, setVisiable] = useState(false)
  const inputRef = useRef<Input>(null)

  const save = (e: any) => {
    const inputValue = e.target!.value
    onChange?.(inputValue)
    setVisiable(false)
  }

  return (
    <div
      onClick={() => {
        setVisiable(true)
        requestAnimationFrame(() => {
          inputRef.current?.focus?.()
        })
      }}
    >
      {visiable ? (
        <Input
          ref={inputRef}
          defaultValue={children}
          onPressEnter={save}
          onBlur={save}
        />
      ) : (
        <div className="editable-cell">{children}</div>
      )}
    </div>
  )
}
