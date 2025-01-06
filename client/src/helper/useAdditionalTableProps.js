import React from 'react'
import { useEditableTableProps } from './useEditableTable'
import { useFilterColumn } from './useFilterColumn'
import { useResizeableTableProps } from './useResizeableTable'

const useAdditionalTableProps = (columns, setColumns, rowKey) => {
  const { transformToEditableColumns, clearEdit, ...restEditableProps } = useEditableTableProps(
    columns,
    setColumns,
    rowKey,
  )
  const { transformToResizeableColumns, ...restResizeableProps } = useResizeableTableProps(
    columns,
    setColumns,
  )
  const mergedColumns = React.useMemo(() => {
    const editableColumns = transformToEditableColumns(columns)
    const resizeableColumns = transformToResizeableColumns(editableColumns)
    return resizeableColumns
  }, [columns, transformToEditableColumns, transformToResizeableColumns])

  const filterColumn = useFilterColumn(columns, setColumns, restEditableProps.title)

  return {
    mergedColumns,
    clearEdit,
    restEditableProps,
    restResizeableProps,
    filterColumn,
  }
}

export default useAdditionalTableProps
