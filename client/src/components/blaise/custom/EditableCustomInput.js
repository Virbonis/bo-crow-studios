import React from 'react'
import { Button, Input, Space, Tooltip } from 'antd'
import { debounce } from 'lodash'
import { ImportOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { Context } from 'components/blaise/shared-components/context-provider'

const dateFormat = 'YYYY-MM-DD HH:mm:ss'

const EditableCustomInput = ({ record, cellProps }) => {
  const { inputName, align, id, isEditing } = cellProps
  const { updatePayload } = React.useContext(Context)
  const [value, setValue] = React.useState(record[inputName])

  const debounceUpdatePayload = React.useCallback(
    debounce(input => {
      updatePayload({ [id]: { [inputName]: input, isEditing } })
    }, 300),
    [updatePayload, id, inputName, isEditing],
  )
  const onChange = e => {
    setValue(e.target.value)
    debounceUpdatePayload(e.target.value)
  }
  return (
    <Space.Compact style={{ width: '100%' }}>
      <Input
        defaultValue={record[inputName]}
        value={value}
        onChange={onChange}
        style={{ textAlign: align }}
      />
      {inputName === 'special_sequence' && (
        <Tooltip title="Paste Match Date">
          <Button
            type="primary"
            icon={<ImportOutlined />}
            onClick={() => setValue(dayjs(record.match_date).format(dateFormat))}
          />
        </Tooltip>
      )}
    </Space.Compact>
  )
}

export default EditableCustomInput
