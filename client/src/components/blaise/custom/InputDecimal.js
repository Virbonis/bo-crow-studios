import React from 'react'
import { InputNumber } from 'antd'
// import { isNaN } from 'lodash'

/**
 * Returns input field for decimal parser without direct update when value is changed
 * @param {decimal} oldValue used to compare with new value
 * @returns {React.Component}
 */
export const InputDecimal = React.forwardRef((props, ref) => {
  const { oldValue, value, className = '', ...restProps } = props

  let newClassName = className
  if (oldValue !== undefined && value !== undefined && !className) {
    newClassName = oldValue !== value ? `bg-orange` : className
  }
  return (
    <InputNumber
      ref={ref}
      step={0.01}
      min={0}
      size="small"
      controls={false}
      maxLength={6}
      parser={v => parseFloat(v).toFixed(2)}
      style={{ padding: 0, width: 50 }}
      value={value}
      className={newClassName}
      {...restProps}
    />
  )
})
export default InputDecimal
