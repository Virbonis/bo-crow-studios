import React from 'react'
import { Button, Checkbox, Form, Input } from 'antd'
import { isEqual } from 'lodash'

export const useEditableTableProps = (columns, setColumns, rowKey) => {
  const [editingKey, setEditingKey] = React.useState([])
  React.useEffect(() => {
    // #add last columns to add checkbox
    if (columns[columns?.length - 1].title !== 'Edit') {
      setColumns(prev => {
        return [
          ...prev,
          {
            title: 'Edit',
            align: 'center',
            fixed: 'right',
            width: 50,
          },
        ]
      })
    }
  }, [rowKey, columns.length, columns, setColumns, editingKey])

  const transformToEditableColumns = React.useCallback(
    prev => {
      // #handle edit and cancel
      const edit = record => setEditingKey(oldArray => [...oldArray, record[rowKey]])
      const cancel = record =>
        setEditingKey(oldArray => oldArray.filter(value => value !== record[rowKey]))
      const isEditing = record => editingKey.includes(record[rowKey])

      const newColumns = [...prev]
      // modify last columns to add checkbox
      newColumns[newColumns.length - 1] = {
        ...newColumns[newColumns.length - 1],
        render: record => (
          <Checkbox
            checked={isEditing(record)}
            onChange={value => {
              if (value.target.checked) edit(record)
              else cancel(record)
            }}
          />
        ),
      }

      const editableColumns = newColumns.map(col => {
        if (!col.editable) return col
        return {
          ...col,
          onCell: record => ({
            record,
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isEditing(record),
            editNode: col.editNode,
            rowKey,
          }),
        }
      })

      return editableColumns
    },
    [rowKey, editingKey],
  )

  const disabled = React.useMemo(() => editingKey.length === 0, [editingKey.length])
  const memoizedProps = React.useMemo(() => {
    return {
      transformToEditableColumns,
      components: {
        body: {
          cell: EditableCell,
          row: EditableRow,
        },
      },
      title: () => <SubmitHandler disabled={disabled} />,
      clearEdit: () => setEditingKey([]),
    }
  }, [disabled, transformToEditableColumns])

  return memoizedProps
}

const SubmitHandler = ({ disabled }) => {
  return (
    <div className="d-flex justify-content-end">
      <Button type="primary" htmlType="submit" disabled={disabled}>
        Submit
      </Button>
    </div>
  )
}

const EditableRow = React.memo(
  ({ index, ...props }) => {
    return <tr {...props} />
  },
  (prev, next) => isEqual(prev, next),
)

const EditableCell = React.memo(
  ({
    editing,
    dataIndex,
    title,
    record,
    index,
    children,
    style,
    editNode = <Input />,
    rowKey,
    ...restProps
  }) => {
    return (
      <td {...restProps} style={{ ...style, borderInlineEnd: '1px solid #d9d9d9' }}>
        {editing ? (
          <Form.Item name={[record[rowKey], dataIndex]} className="m-0">
            {editNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    )
  },
)

export default useEditableTableProps
