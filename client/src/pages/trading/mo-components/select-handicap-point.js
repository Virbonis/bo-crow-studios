import React, { useState } from 'react'
import { Select } from 'antd'

const SelectHandicapPoint = React.forwardRef((props, ref) => {
  const [value, setValue] = useState(0)
  React.useImperativeHandle(ref, () => ({
    get value() {
      return value
    },
  }))
  return (
    <Select
      value={value}
      onChange={v => setValue(v)}
      size="small"
      className="w-100"
      suffixIcon={null}
      options={[
        { value: 0, label: '-' },
        { value: 0.25, label: 0.25 },
        { value: 0.5, label: 0.5 },
        { value: 0.75, label: 0.75 },
        { value: 1, label: 1 },
      ]}
    />
  )
})

export default SelectHandicapPoint
