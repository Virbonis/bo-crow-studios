import React from 'react'
import { Button, Table } from 'antd'
import { Amount } from 'components/blaise'
import ButtonSettle from './button-settle'

const TableEarlySettlement = React.memo(
  ({ match_id, list, UpdateEarlySettlement, successCallback, EditEarlySettlementBetList }) => {
    const columns = [
      // {
      //   title: '',
      //   render: row => {
      //     const disabled = row.st_settle === 0 || row.st_settle === 99
      //     return <Checkbox disabled={disabled} />
      //   },
      // },
      {
        title: 'Score',
        render: row => (
          <>
            {row.home_posisi} - {row.away_posisi}
          </>
        ),
      },
      {
        title: 'HT/FT',
        dataIndex: 'st_process_type',
        render: text => getStProcessTypeName(text),
      },
      {
        title: 'Ticket',
        render: ({ st_settle, early_settlement_id, total_ticket }) => {
          if (st_settle === -1)
            return (
              <Button
                size="small"
                type="link"
                onClick={() => EditEarlySettlementBetList({ match_id, early_settlement_id })}
              >
                List
              </Button>
            )
          const val = Number(total_ticket)
          if (val !== 0) return <Amount value={val} int />
          return '-'
        },
      },
      {
        title: 'Action',
        render: row => {
          if (row.st_settle === 99) return 'Queue'
          if (row.st_settle === 0) return null
          return (
            <ButtonSettle
              match_id={match_id}
              {...row}
              UpdateEarlySettlement={UpdateEarlySettlement}
              successCallback={successCallback}
            />
          )
        },
      },
    ]
    return (
      <>
        <Table
          rowKey={row => `${row.early_settlement_id}${row.st_settle}`}
          dataSource={list}
          columns={columns}
          size="small"
          pagination={false}
          rowClassName={row => (row.st_settle === -1 ? 'bg-gray-5' : '')}
        />
      </>
    )
  },
)

export default TableEarlySettlement
function getStProcessTypeName(val) {
  switch (val) {
    case 6:
      return 'HT'
    case 5:
      return 'FT'
    case 4:
      return 'HTFT'
    default:
      return ''
  }
}
