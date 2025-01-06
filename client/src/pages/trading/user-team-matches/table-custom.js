/* eslint-disable react/no-array-index-key */
import React from 'react'
import './custom.scss'

const TableCustom = ({ columns, dataSource }) => {
  return (
    <div
      style={{
        height: 'calc(100% - 24px)',
        boxShadow: 'inset -10px 0 8px -8px rgba(0, 0, 0, 0.15)',
      }}
    >
      <div id="dvDetail" className="dvDetail">
        <table className="table table-bordered mb-0">
          <colgroup>
            {columns.map((col, index) => {
              if (col.children)
                return col.children.map((e, chIndex) => (
                  <col key={`${index}${chIndex}`} style={{ width: e.width || col.width }} />
                ))

              return <col key={index} style={{ width: col.width }} />
            })}
          </colgroup>
          <thead>
            <tr>
              {columns.map((col, index) => {
                if (!col.children)
                  return (
                    <th rowSpan="2" key={index}>
                      {col.title}
                    </th>
                  )

                return (
                  <th colSpan="2" align="center" key={index}>
                    {col.title}
                  </th>
                )
              })}
            </tr>
            <tr>
              {columns.map(col => {
                if (col.children) {
                  return col.children.map((e, index) => <th key={`th${index}`}>{e.title}</th>)
                }
                return null
              })}
            </tr>
          </thead>
          <tbody>
            {dataSource.map((row, trIndex) => {
              return (
                <tr key={trIndex}>
                  {columns.map((col, tdIndex) => {
                    const { render, dataIndex, onCell } = col
                    const cellProps = onCell ? onCell(row) : {}
                    let cellData
                    if (col.children) {
                      return col.children.map((e, chIndex) => {
                        const { render: renderChildren, dataIndex: indexChildren } = e
                        cellData = row[indexChildren]
                        return (
                          <td key={`${tdIndex}${chIndex}`} {...cellProps}>
                            {renderChildren ? renderChildren(row) : cellData}
                          </td>
                        )
                      })
                    }
                    cellData = row[dataIndex]
                    // if (dataIndex instanceof Array)
                    //   cellData = dataIndex.reduce((acc, curr) => acc[curr], row)
                    // else cellData = row[dataIndex]
                    return (
                      <td key={tdIndex} {...cellProps}>
                        {render ? render(row) : cellData}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TableCustom
