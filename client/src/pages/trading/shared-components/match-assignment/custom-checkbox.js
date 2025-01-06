import React from 'react'

const CustomCheckbox = ({ checked = false, ...restProps }) => {
  return <input type="checkbox" checked={checked} {...restProps} readOnly />
}

export default CustomCheckbox
