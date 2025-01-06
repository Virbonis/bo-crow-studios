import React from 'react'
// import { Checkbox } from 'antd'

const CheckboxHide = ({ row_id, isHidden, setHiddenRows }) => {
  const onChange = e => {
    const { checked } = e.target
    if (checked) setHiddenRows(prev => [...prev, row_id])
    else setHiddenRows(prev => prev.filter(x => x !== row_id))
  }
  return <input type="checkbox" checked={isHidden} onChange={onChange} />
}

export default CheckboxHide
