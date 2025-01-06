import React from 'react'
import { Select } from 'antd'
import { groupOptions } from 'helper'

const SelectGroup = props => {
  const { viewParameter, setViewParameter } = props

  const onChange = value => {
    setViewParameter(prev => ({
      ...prev,
      price_group: value,
      current_page: 1,
    }))
  }
  return (
    <Select
      style={{ width: '100px' }}
      value={viewParameter.price_group}
      onChange={onChange}
      options={groupOptions}
    />
  )
}

export default SelectGroup
