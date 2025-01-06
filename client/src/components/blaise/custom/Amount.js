import React from 'react'
import { isFinite, isNaN } from 'lodash'

export const Amount = ({
  bold = false,
  int = false,
  length = 2,
  value = 0,
  mc = false,
  brackets = false,
  noColor = false,
  keepMinus = true,
  keepRed = false,
  className: propClassName = '',
  ...restProps
}) => {
  if (int) length = 0

  let className = 'text-reset'
  if (value < 0) className = 'text-red'
  if (mc) className = 'text-blue'
  if (keepRed) className = 'text-red'
  if (noColor) className = 'text-reset'
  if (bold) className += ' font-weight-bold'

  if (value < 0 && !keepMinus) value *= -1
  const result = amount(value, length)
  return (
    <span className={`${propClassName} ${className}`} {...restProps}>
      {!keepMinus && brackets ? `(${result})` : result}
    </span>
  )
}

export const amount = (value, length = 2) => {
  const val = parseFloat(value)
  if (isNaN(val) || !isFinite(val)) return 0

  const minLength = Math.min(2, length)
  const maxLength = Math.max(2, length)
  return val.toLocaleString('en', {
    minimumFractionDigits: length === 0 ? 0 : minLength,
    maximumFractionDigits: length === 0 ? 0 : maxLength,
  })
}

export default Amount
