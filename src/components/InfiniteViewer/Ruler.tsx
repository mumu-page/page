import React, {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useContext,
} from 'react'
import Guides from '@scena/react-guides'
import { Store } from '@r-generate/core'

const { Context, actionTypes } = Store
const { SET_MOVEABLE_OPTIONS } = actionTypes
let observer: MutationObserver | null = null
export default forwardRef((props: GuidesOptions, ref) => {
  const { type } = props
  const guides: any = React.useRef()
  const { setGlobal: commonDispatch } = useContext(Context)

  useImperativeHandle(
    ref,
    () => ({
      guides,
    }),
    []
  )

  const onResize = useCallback(() => {
    guides.current?.resize?.()
  }, [])

  const onWheel = useCallback((e) => {
    let scrollX = 0
    let scrollY = 0
    scrollX += e.deltaX
    scrollY += e.deltaY
    guides?.scrollGuides?.(scrollY)
    guides?.scroll?.(scrollX)
  }, [])

  useEffect(() => {
    guides.current?.resize?.()
    const element = document.querySelector('.container')
    observer = new MutationObserver((mutationList) => {
      onResize()
    })
    observer?.observe?.(element as any, {
      attributes: true,
      childList: true,
      characterData: true,
    })
    window.addEventListener('wheel', onWheel)
    window.addEventListener('resize', onResize)
    return () => {
      observer?.disconnect?.()
      observer = null
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <Guides
      {...props}
      ref={guides}
      onChangeGuides={({ guides }) => {
        // 去除误差
        let _guides = guides.map((item: any) => {
          return Number(item) + 30.5
        })
        if (type === 'horizontal') {
          commonDispatch({
            type: SET_MOVEABLE_OPTIONS,
            payload: {
              horizontalGuidelines: _guides,
            },
          })
        }
        if (type === 'vertical') {
          commonDispatch({
            type: SET_MOVEABLE_OPTIONS,
            payload: {
              verticalGuidelines: _guides,
            },
          })
        }
      }}
    />
  )
})

export interface RulerProps {
  type?: 'horizontal' | 'vertical'
  width?: number
  height?: number
  unit?: number
  zoom?: number
  direction?: 'start' | 'end'
  style?: any
  backgroundColor?: string
  lineColor?: string
  textColor?: string
}

export interface GuidesOptions extends RulerProps {
  className?: string
  setGuides?: (guides: number[]) => any
  rulerStyle?: any
  snapThreshold?: number
  snaps?: number[]
  displayDragPos?: boolean
  dragPosFormat?: (value: number) => string | number
}

export interface GuidesInterface {
  getGuides(): number[]
  scroll(pos: number): void
  scrollGuides(pos: number): void
  loadGuides(guides: number[]): void
  resize(): void
}
