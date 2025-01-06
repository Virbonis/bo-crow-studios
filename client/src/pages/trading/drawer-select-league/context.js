import React, { createContext } from 'react'

const RowSelectionContext = createContext(null)

const useRowSelection = () => {
  const [selectedRowKeys, setSelectedRowKeys] = React.useState([])

  // const onSelectChange = React.useCallback(
  //   selectedRowKeys => {
  //     setSelectedRowKeys(selectedRowKeys)
  //   },
  //   [setSelectedRowKeys],
  // )

  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: onSelectChange,
  // }

  return [selectedRowKeys, setSelectedRowKeys]
}

export { useRowSelection }
export default RowSelectionContext
