import React from 'react'
import { Select } from 'antd'
import { Context } from 'components/blaise/shared-components/context-provider'

const EditableCustomSelect = ({ record, cellProps, options, ...restProps }) => {
  const { inputName, align, id, isEditing } = cellProps
  const { mode, delimiter } = restProps
  const { updatePayload } = React.useContext(Context)

  const [value, setValue] = React.useState(
    mode === 'multiple' ? record[inputName]?.split(delimiter) || [] : record[inputName],
  )

  const onChange = changedValue => {
    setValue(changedValue)
    updatePayload({
      [id]: {
        [inputName]: mode === 'multiple' ? changedValue?.join(delimiter) : changedValue,
        isEditing,
      },
    })
  }
  return (
    <Select
      value={value}
      mode={mode}
      options={options}
      onChange={onChange}
      style={{ textAlign: align, width: '100%' }}
      {...restProps}
    />
  )
}
export default EditableCustomSelect
