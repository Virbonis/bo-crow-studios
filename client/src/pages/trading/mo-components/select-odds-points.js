import React from 'react'
import { Select } from 'antd'
import SelectOddsPoint from './select-odds-point'

const SelectOddsPoints = ({ placeholder, ref1, ref2, ref3 }) => {
  return (
    <Select
      className="w-100"
      popupMatchSelectWidth={120}
      placeholder={placeholder}
      dropdownRender={() => (
        <div className="p-1" style={{ display: 'grid', gridTemplateColumns: 'auto auto' }}>
          1st <SelectOddsPoint ref={ref1} />
          2nd <SelectOddsPoint ref={ref2} />
          3rd <SelectOddsPoint ref={ref3} />
        </div>
      )}
    />
  )
}

export default SelectOddsPoints
