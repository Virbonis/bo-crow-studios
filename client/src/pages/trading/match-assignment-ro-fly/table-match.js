import React from 'react'
import { connect } from 'react-redux'
import { Table } from 'antd'
import { isEqual } from 'lodash'
import { CustomizeCell } from 'components/blaise'
import ButtonDetail from '../shared-components/match-assignment/button-detail'
import ButtonLog from '../shared-components/match-assignment/button-log'

const mapStateToProps = ({ matchAssignment }) => ({
  data: matchAssignment.dataMatch,
})

const columnMatch = [
  {
    title: 'Sport',
    dataIndex: 'sport_name',
    align: 'center',
    width: '100px',
  },
  {
    title: 'Match ID / Match Date',
    width: '120px',
    align: 'center',
    render: record => {
      return (
        <span>
          <span className={`icon_${toSnakeCase(record.match_time_slot)}`} /> {record.match_id}
          <br /> {record.match_date}
        </span>
      )
    },
  },
  {
    title: 'League',
    dataIndex: 'league_name',
    width: '150px',
  },
  {
    title: 'Home Away',
    align: 'left',
    width: '220px',
    render: record => <ButtonLog record={record} />,
  },
  {
    title: 'Runnning Ball',
    children: [
      {
        title: 'HT',
        width: '100px',
        render: record => <ButtonDetail record={record} traderType="RBHT" isReadOnly />,
      },
      {
        title: 'FT',
        width: '100px',
        render: record => <ButtonDetail record={record} traderType="RBFT" isReadOnly />,
      },
    ],
  },
]

const TableMatch = React.memo(
  ({ data }) => {
    const onRow = (record, index) => {
      const { sport_name } = record
      const isLastIndexSportName = sport_name !== data[index + 1]?.sport_name
      return {
        className: isLastIndexSportName && index !== data.length - 1 ? 'custom_border_bottom' : '',
      }
    }
    return (
      <>
        <div className="d-flex flex-row justify-content-between header-style">
          <div>Assign Match</div>
        </div>
        <Table
          id="table-match"
          className="w-100"
          size="small"
          bordered
          rowKey="match_id"
          columns={columnMatch}
          dataSource={data}
          pagination={false}
          components={{
            body: {
              cell: CustomizeCell,
            },
          }}
          scroll={{ x: 'max-content', y: 500 }}
          onRow={onRow}
        />
      </>
    )
  },
  (prev, next) => isEqual(prev.data, next.data),
)

const toSnakeCase = str =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('_')

// }

export default connect(mapStateToProps, null)(TableMatch)
