import React, { useState } from 'react'
import { Select } from 'antd'

const SelectOddsPoint = React.memo(
  React.forwardRef((props, ref) => {
    const [value, setValue] = useState(1)
    React.useImperativeHandle(ref, () => ({
      get value() {
        return value
      },
    }))
    return (
      <Select
        className="w-100"
        value={value}
        onChange={v => setValue(v)}
        suffixIcon={null}
        options={[
          { value: 1, label: '1 point' },
          { value: 2, label: '2 point' },
          { value: 3, label: '3 point' },
          { value: 4, label: '4 point' },
          { value: 5, label: '5 point' },
          { value: 6, label: '6 point' },
          { value: 7, label: '7 point' },
          { value: 8, label: '8 point' },
          { value: 9, label: '9 point' },
          { value: 10, label: '10 point' },
        ]}
      />
    )
  }),
)

export default SelectOddsPoint
