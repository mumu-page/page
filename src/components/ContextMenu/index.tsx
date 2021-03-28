import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
  useRef,
} from 'react'
import { createPortal } from 'react-dom'
import './index.less'

export default forwardRef((props: any, ref) => {
  const { children } = props
  const [el] = useState(document.body)
  const [visiable, setVisiable] = useState(false)
  const conteMenu = useRef(null)

  const hideContextMenu = useCallback(() => {
    setVisiable(false)
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      hide() {
        setVisiable(false)
      },
      show(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        setVisiable(true)
        const { clientX, clientY } = e
        const el = conteMenu.current as any
        el.style.left = `${clientX}px`
        el.style.top = `${clientY}px`
      },
    }),
    []
  )

  useEffect(() => {
    window.addEventListener('click', hideContextMenu)
    return () => {
      window.removeEventListener('click', hideContextMenu)
    }
  }, [])

  return createPortal(
    <div id="context-menu" ref={conteMenu} className={!visiable ? 'hide' : ''}>
      {children}
    </div>,
    el
  )
})
