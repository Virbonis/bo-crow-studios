import { Modal } from 'antd'
import Draggable from 'react-draggable'
import React, { useState } from 'react'

export const DragableModal = props => {
  // #region draggable
  const [state, setState] = useState({
    disabled: true,
    bounds: { left: 0, top: 0, bottom: 0, right: 0 },
  })
  const { bounds, disabled } = state
  const draggleRef = React.createRef()
  const onStart = (event, uiData) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement
    const targetRect = draggleRef?.current?.getBoundingClientRect()
    setState(prev => ({
      ...prev,
      bounds: {
        left: -targetRect?.left + uiData?.x,
        right: clientWidth - (targetRect?.right - uiData?.x),
        top: -targetRect?.top + uiData?.y,
        bottom: clientHeight - (targetRect?.bottom - uiData?.y),
      },
    }))
  }
  // #endregion
  const { title, children, ...restProps } = props
  return (
    <Modal
      title={
        <div
          style={{
            width: '100%',
            cursor: 'move',
          }}
          onMouseOver={() => {
            if (disabled) {
              setState(prev => ({
                ...prev,
                disabled: false,
              }))
            }
          }}
          onMouseOut={() => {
            setState(prev => ({
              ...prev,
              disabled: true,
            }))
          }}
          // fix eslintjsx-a11y/mouse-events-have-key-events
          // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
          onFocus={() => {}}
          onBlur={() => {}}
          // end
        >
          {title}
        </div>
      }
      modalRender={modal => (
        <Draggable
          disabled={disabled}
          bounds={bounds}
          onStart={(event, uiData) => onStart(event, uiData)}
        >
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
      {...restProps}
    >
      {children}
    </Modal>
  )
}
export default DragableModal
