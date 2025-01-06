import React from 'react'
import { Checkbox } from 'antd'

export const CheckboxList = props => {
  const { options = [], columns = 1, ...restProps } = props
  const rowCount = Math.ceil(options.length / columns)
  return (
    <Checkbox.Group
      {...restProps}
      style={{
        display: 'grid',
        gridTemplateRows: `repeat(${rowCount}, auto)`,
        gridAutoFlow: 'column',
      }}
      options={options}
    >
      {options.map(o => (
        <Checkbox key={o.value} {...o} className="h-auto ml-0">
          {o.label}
        </Checkbox>
      ))}
    </Checkbox.Group>
  )
}

export default CheckboxList
