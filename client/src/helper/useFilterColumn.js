import { Select } from 'antd'
import React from 'react'

export const useFilterColumn = (columns, setColumns, additionalTitle = null) => {
  const columnsFilter = React.useRef(columns)
  const filterChange = React.useCallback(
    value => {
      const changeColumns = columnsFilter.current
        .filter(prevVal => value.includes(prevVal.title))
        .concat(columnsFilter.current.filter(v => v.title === ''))

      setColumns([
        ...changeColumns,
        {
          title: 'Edit',
          align: 'center',
          fixed: 'right',
          width: 50,
        },
      ])
    },
    [setColumns],
  )

  const filterColumnOptions = React.useMemo(
    () =>
      columnsFilter.current
        .map(val => ({
          title: val.title,
          value: val.title,
        }))
        .filter(v => v.title !== ''),
    [columnsFilter],
  )

  const memoizedProps = React.useMemo(() => {
    return {
      title: () => {
        return (
          <div className="w-100 d-flex flex-row">
            <Select
              mode="multiple"
              className="w-50"
              options={filterColumnOptions}
              value={columns.map(v => v.title).filter(v => v !== '' && v !== 'Edit')}
              onChange={filterChange}
            />
            {additionalTitle && <div className="w-50">{additionalTitle}</div>}
          </div>
        )
      },
    }
  }, [additionalTitle, columns, filterChange, filterColumnOptions])

  return memoizedProps
}

export default useFilterColumn
