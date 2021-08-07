import React, { useCallback, useEffect } from 'react'
import Moveable from 'react-moveable'
import {
  SET_TARGET,
  SET_MOVEABLE_OPTIONS,
  UPDATE_COMPONENT_LIST_BY_TARGET,
  useStore,
} from '@r-generator/stores'

const layout = {
  frame: { translate: [0, 0] },
} as any
export default () => {
  const { target, moveableOptions = {}, setGlobal } = useStore()

  const {
    target: target2,
    elementGuidelines,
    frame = { translate: [0, 0] },
    bounds,
    verticalGuidelines,
    horizontalGuidelines,
    draggable = true,
    resizable = true,
  } = moveableOptions as any

  const onWinResize = useCallback((leftVal = 0, rightVal = 0) => {
    const parentEl = document.querySelector('.viewport')
    const { left, right, top, bottom } =
      parentEl?.getBoundingClientRect?.() || {}
    // Moveable的bounds是基于整个窗口的
    // 而getBoundingClientRect是基于当前元素，因此存在误差
    setGlobal({
      type: SET_MOVEABLE_OPTIONS,
      payload: {
        bounds: {
          left: Number(left) - leftVal - 50,
          right: Number(right) - rightVal - 52,
          top,
          // bottom: Number(bottom) - 2,
        },
      },
    })
  }, [])

  useEffect(() => {
    onWinResize()
  }, [])

  useEffect(() => {
    const { layout = {} } = target
    setGlobal({
      type: SET_MOVEABLE_OPTIONS,
      payload: layout,
    })
  }, [target])

  return (
    <Moveable
      target={target2}
      // ------------------ 辅助线开始 ------------------
      elementGuidelines={elementGuidelines}
      verticalGuidelines={verticalGuidelines}
      horizontalGuidelines={horizontalGuidelines}
      // ------------------ 辅助线结束 ------------------
      // ------------------ 限制范围开始 ------------------
      snappable={true}
      snapThreshold={5}
      isDisplaySnapDigit={true}
      snapGap={true}
      snapElement={true}
      snapVertical={true}
      snapHorizontal={true}
      snapCenter={false}
      snapDigit={0}
      bounds={bounds}
      // ------------------ 限制范围结束 ------------------
      // ------------------ 拖拽开始 ------------------
      draggable={draggable}
      throttleDrag={0}
      startDragRotate={0}
      throttleDragRotate={0}
      // ------------------ 拖拽结束 ------------------
      zoom={1}
      origin={false}
      padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
      // ------------------ 调整大小开始 ------------------
      resizable={resizable}
      keepRatio={false}
      throttleResize={0}
      edge={false}
      renderDirections={['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']}
      // ------------------ 调整大小结束 ------------------
      onDragStart={(e) => {
        e.set(frame.translate)
      }}
      onDrag={(e) => {
        layout.frame.translate = e.beforeTranslate
        e.target.style.transform = `translate(${e.beforeTranslate[0]}px, ${e.beforeTranslate[1]}px)`
      }}
      onDragEnd={({ target, isDrag, clientX, clientY }) => {
        // console.log('onDragEnd', target, isDrag, clientX, clientY)
        const { frame } = layout
        setGlobal({
          type: SET_TARGET,
          payload: {
            layout: {
              frame,
              clientX,
              clientY,
            },
          },
        })
        setGlobal({
          type: UPDATE_COMPONENT_LIST_BY_TARGET,
          payload: {
            data: {
              layout: {
                frame,
                clientX,
                clientY,
              },
            },
          },
        })
      }}
      onResizeStart={(e) => {
        e.setOrigin(['%', '%'])
        e.dragStart && e.dragStart.set(frame.translate)
      }}
      onResize={({ target, width, height, drag }) => {
        const beforeTranslate = drag.beforeTranslate
        layout.width = width
        layout.height = height
        layout.frame.translate = drag.beforeTranslate
        target.style.width = `${width}px`
        target.style.height = `${height}px`
        target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`
      }}
      onResizeEnd={({ lastEvent }) => {
        // console.log("lastEvent", lastEvent);
        if (lastEvent) {
          const { frame, width, height } = layout
          setGlobal({
            type: SET_TARGET,
            payload: {
              layout: {
                frame,
                width,
                height,
              },
            },
          })
          setGlobal({
            type: UPDATE_COMPONENT_LIST_BY_TARGET,
            payload: {
              data: {
                layout: {
                  frame,
                  width,
                  height,
                },
              },
            },
          })
        }
      }}
    />
  )
}
