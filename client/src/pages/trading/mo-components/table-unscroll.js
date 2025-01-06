import React from 'react'
import { isEqual } from 'lodash'

const CustomTable = ({ tableRef, rowKey, columns, dataSource, onRow, lastRowElementRef }) => {
  return (
    <div className="ant-table-wrapper">
      <div id="table-trading" className="ant-table">
        <div className="ant-table-container">
          <div id="dvHeader" className="ant-table-header">
            <table className="table table-bordered mb-0">
              <colgroup>
                {columns.map((col, colIndex) => (
                  <col
                    key={col.key || col.dataIndex || colIndex}
                    style={{
                      width: col.width,
                      display: col.hidden ? 'none' : 'table-column',
                    }}
                  />
                ))}
              </colgroup>
              <thead className="ant-table-thead">
                <tr className="ant-table-row">
                  {columns.map((col, colIndex) => (
                    <th
                      key={col.key || col.dataIndex || colIndex}
                      className="ant-table-cell"
                      style={{
                        display: col.hidden ? 'none' : 'table-cell',
                      }}
                    >
                      {typeof col.title === 'function' ? col.title() : col.title}
                    </th>
                  ))}
                </tr>
              </thead>
            </table>
          </div>
          <div id="dvDetail" className="ant-table-body" ref={tableRef} style={{ height: '100%' }}>
            <table className="table table-bordered mb-0">
              <colgroup>
                {columns.map((col, colIndex) => (
                  <col
                    key={col.key || col.dataIndex || colIndex}
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
        {columns.map((col, colIndex) => {
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

          if (cellProps.rowSpan === 0 || cellProps.colSpan === 0) return null
          return (
            <td
              key={col.key || col.dataIndex || colIndex}
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

export default CustomTable
