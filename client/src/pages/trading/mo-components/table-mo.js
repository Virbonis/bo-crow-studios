/* eslint-disable react/no-array-index-key */
import React from 'react'
import './custom.scss'
import { isEqual } from 'lodash'

const onScrollDiv = () => {
  document.getElementById('dvHeader').scrollLeft = document.getElementById('dvDetail').scrollLeft
}

// function getDepth(arr) {
//   // Base case: if the array is empty, the depth is 0
//   if (!Array.isArray(arr) || arr.length === 0) return 0;
//   // Initialize the depth
//   let depth = 0;
//   // Iterate over each object in the array
//   for (const obj of arr) {
//     // Check if the object has a children property and it's an array
//     if (obj.children && Array.isArray(obj.children)) {
//       // Recursively get the depth of the children and update the depth
//       depth = Math.max(depth, getDepth(obj.children));
//     }
//   }
//   // Return the maximum depth plus 1 for the current level
//   return depth + 1;
// }

const TableMO = ({ tableRef, rowKey, columns, dataSource, onRow, lastRowElementRef }) => {
  // const rowsLevel = columns.
  // const rowsLevel = React.useMemo(() => {
  //   return getDepth(columns)
  // },[columns])

  // event listener for col resize width
  const colGroupHead = React.useRef()
  const colGroupBody = React.useRef()
  React.useEffect(() => {
    const callBackObserver = entries => {
      entries.forEach(entry => {
        entry.target.childNodes.forEach((col, idx) => {
          const { clientWidth } = col
          colGroupHead.current.children[idx].style.width = `${clientWidth}px`
        })
      })
    }
    const resizeObserver = new ResizeObserver(callBackObserver)
    const mutationObserver = new MutationObserver(callBackObserver)
    resizeObserver.observe(colGroupBody.current)
    mutationObserver.observe(colGroupBody.current, { childList: true })
    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [])

  return (
    <div className="ant-table-wrapper">
      <div id="table-mo" className="ant-table">
        <div className="ant-table-container">
          <div id="dvHeader" className="ant-table-header">
            <table className="table table-bordered mb-0">
              <colgroup ref={colGroupHead}>
                {columns.map((col, index) => (
                  <col
                    key={index}
                    style={{
                      width: col.width,
                      display: col.hidden ? 'none' : 'table-column',
                    }}
                  />
                ))}
                <col style={{ width: 17 }} />
              </colgroup>
              <thead className="ant-table-thead">
                <tr className="ant-table-row">
                  {columns.map((col, thIndex) => (
                    <th
                      key={thIndex}
                      className="ant-table-cell"
                      style={{
                        display: col.hidden ? 'none' : 'table-cell',
                      }}
                    >
                      {typeof col.title === 'function' ? col.title() : col.title}
                    </th>
                  ))}
                  <th style={{ width: 17, maxWidth: 17, height: 22, maxHeight: 22 }} />
                </tr>
              </thead>
            </table>
          </div>
          <div
            id="dvDetail"
            className="dvDetail"
            onScroll={onScrollDiv}
            ref={tableRef}
            style={{ height: '100%' }}
          >
            <table className="table table-bordered mb-0">
              <colgroup ref={colGroupBody}>
                {columns.map((col, index) => (
                  <col
                    key={index}
                    style={{
                      width: col.width,
                      display: col.hidden ? 'none' : 'table-column',
                    }}
                  />
                ))}
              </colgroup>
              <tbody className="ant-table-tbody">
                {dataSource.map((record, trIndex) => {
                  const key = typeof rowKey === 'function' ? rowKey(record) : record[rowKey]
                  const className = onRow?.(record, trIndex)?.className
                  const onClick = onRow?.(record, trIndex)?.onClick
                  return (
                    <TableRow
                      key={key}
                      trIndex={trIndex}
                      columns={columns}
                      record={record}
                      className={className}
                      onClick={onClick}
                    />
                  )
                })}
                <tr ref={lastRowElementRef} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
const TableRow = React.memo(
  props => {
    const { columns, record, trIndex, className, onClick } = props
    return (
      <tr className={className} onClick={onClick}>
        {columns.map((col, tdIndex) => {
          const { render, dataIndex, onCell, align = 'left' } = col
          const cellProps = onCell ? onCell(record) : {}
          let cellData
          if (dataIndex instanceof Array)
            cellData = dataIndex.reduce((acc, curr) => acc[curr], record)
          else cellData = record[dataIndex]

          let content
          if (render && dataIndex) content = render(cellData, record, trIndex)
          else if (render && !dataIndex) content = render(record, record, trIndex)
          else content = cellData

          // if ([10, 18, 21].includes(tdIndex)) return <td>empty</td>

          if (cellProps.rowSpan === 0 || cellProps.colSpan === 0) return null
          return (
            <td
              key={tdIndex}
              style={{
                textAlign: align,
                display: col.hidden ? 'none' : 'table-cell',
              }}
              {...cellProps}
            >
              {content}
            </td>
          )
        })}
      </tr>
    )
  },
  (prevProps, nextProps) => {
    return (
      isEqual(prevProps.record, nextProps.record) &&
      isEqual(prevProps.className, nextProps.className) &&
      isEqual(prevProps.columns, nextProps.columns)
    )
  },
)

export default TableMO
