import React, { useContext, useEffect } from 'react'
import Moveable from 'react-moveable'
import {
  SET_COMPONENT_LIST,
  SET_CURRENT_DRAG_COMPONENT,
  SET_MOVEABLE_OPTIONS,
  UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
} from '../../stores/action-type'
import { Context } from '../../stores/context'

const _frame = {} as any
export default () => {
  const { moveableOptions = {}, commonDispatch } = useContext(Context)
  const {
    target,
    elementGuidelines,
    frame = { translate: [0, 0] },
    bounds,
  } = moveableOptions as any
  console.log('moveableOptions', moveableOptions)

  const onWinResize = React.useCallback(() => {
    const parentEl = document.querySelector('.editor-area-scroll')
    const { left, right, top, bottom } = parentEl?.getBoundingClientRect() || {}
    commonDispatch({
      type: SET_MOVEABLE_OPTIONS,
      payload: {
        bounds: {
          left,
          right,
          top,
          bottom,
        },
      },
    })
  }, [])

  useEffect(() => {
    onWinResize()
    window.addEventListener('resize', onWinResize)
    return () => {
      window.removeEventListener('resize', onWinResize)
    }
  }, [])

  return (
    <Moveable
      target={target}
      elementGuidelines={elementGuidelines}
      snappable={true}
      bounds={bounds}
      verticalGuidelines={[0, 200, 400]}
      horizontalGuidelines={[0, 200, 400]}
      snapThreshold={5}
      isDisplaySnapDigit={true}
      snapGap={true}
      snapElement={true}
      snapVertical={true}
      snapHorizontal={true}
      snapCenter={false}
      snapDigit={0}
      draggable={true}
      throttleDrag={0}
      startDragRotate={0}
      throttleDragRotate={0}
      zoom={1}
      origin={false}
      padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
      onDragStart={(e) => {
        e.set(frame.translate)
      }}
      onDrag={(e) => {
        _frame.translate = e.beforeTranslate
        e.target.style.transform = `translate(${e.beforeTranslate[0]}px, ${e.beforeTranslate[1]}px)`
      }}
      onDragEnd={({ target, isDrag, clientX, clientY }) => {
        // console.log('onDragEnd', target, isDrag, clientX, clientY)
        commonDispatch({
          type: SET_CURRENT_DRAG_COMPONENT,
          payload: {
            frame: _frame,
          },
        })
        commonDispatch({
          type: UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
          payload: {
            data: {
              frame: _frame,
            },
          },
        })
      }}
    />
  )
}
