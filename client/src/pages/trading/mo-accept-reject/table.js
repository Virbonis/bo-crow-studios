import React from 'react'
import { Table, Space } from 'antd'
import {
  Amount,
  TextAwayFav,
  TextHomeFav,
  VIPUsername,
  getBetScore,
  HDPColumn,
  GameTypeColumn,
} from 'components/blaise'
import { listGT } from 'helper'
import './custom.scss'

const columns = [
  {
    title: 'Username',
    render: record => <VIPUsername username={record.username} vip_code={record.vip_code} />,
    width: 115,
  },
  { title: 'Branch', dataIndex: 'branch_alias', width: 100 },
  {
    title: 'Bet ID',
    render: record => (
      <span>
        {record.bet_id}
        {record.p_bet_id}
      </span>
    ),
    width: 100,
  },
  {
    title: 'Home/Over',
    render: record => <TextHomeFav {...record} />,
    width: 100,
  },
  {
    title: 'Away/Under',
    render: record => <TextAwayFav {...record} />,
    width: 100,
  },
  {
    title: 'Game Type',
    align: 'center',
    render: record => {
      // hardcode parlay_combo_ticket = 1 biar ga jadi button
      return <GameTypeColumn {...record} parlay_combo_ticket={1} />
    },
    width: 50,
  },
  {
    title: 'Score',
    align: 'center',
    render: (text, record) => getBetScore(record),
    width: 50,
  },
  {
    title: 'HDP',
    align: 'center',
    render: record => <HDPColumn {...record} bet_fav_status={record.st_fav} />,
    width: 50,
  },
  {
    title: 'Odds',
    align: 'right',
    dataIndex: 'odds',
    render: text => <Amount value={text} />,
    width: 50,
  },
  {
    title: 'C. Amt',
    align: 'right',
    dataIndex: 'bet_amount_comp',
    render: text => <Amount value={text} bold int />,
    width: 50,
  },
  {
    title: 'Amt',
    align: 'right',
    dataIndex: 'bet_amount',
    render: text => <Amount value={text} int bold className="text-magenta" />,
    width: 50,
  },
  {
    title: 'Bet Date',
    dataIndex: 'bet_date',
    render: text => text.formatDateTimeSecond(),
    width: 150,
  },
]
const TableAcceptReject = React.forwardRef(({ data }, ref) => {
  const [selectedRows, setSelectedRows] = React.useState([])

  React.useImperativeHandle(ref, () => {
    return {
      selectedRows,
      setSelectedRows,
    }
  })

  return (
    <Table
      id="table-bet-listing"
      rowKey="bet_id"
      columns={columns}
      dataSource={data}
      bordered
      pagination={false}
      scroll={{ x: '100%', y: true }}
      rowSelection={{
        selectedRowKeys: selectedRows,
        onChange: selectedRowKeys => setSelectedRows(selectedRowKeys),
      }}
      onRow={record => {
        return {
          onClick: () => {
            setSelectedRows(old => {
              if (old.includes(record.bet_id)) {
                return old.filter(item => item !== record.bet_id)
              }
              return [...old, record.bet_id]
            })
          },
          className: getAcceptRejectClass(record.status, record.void_id, record.game_type),
        }
      }}
      footer={() => (
        <Space className="font-weight-bold" direction="vertical" size={8}>
          <div>
            To AcRj one ticket:
            <br />
            1. Untick checkbox ACRJ BY MATCH.
            <br />
            2. Set dropdown Refresh to NONE.
            <br />
            3. Tick the desired ticket.
          </div>
          <div>
            To AcRj whole tickets in one match (including tickets in special matches):
            <br />
            1. Tick checkbox ACRJ BY MATCH.
            <br />
            2. Ignore checkbox CHECK ALL
          </div>
          <div>
            To AcRj whole tickets in this screen (Exclude tickets in special matches):
            <br />
            1. Untick checkbox ACRJ BY MATCH.
            <br />
            2. Tick checkbox CHECK ALL
          </div>
        </Space>
      )}
    />
  )
})

export default TableAcceptReject

export function getAcceptRejectClass(status, voidID, gameType) {
  if (status === 0) {
    if (listGT['1X2'].includes(gameType)) return 'bg-light-green' // pending1x2
    if (listGT.Handicap.includes(gameType)) return 'bg-light-yellow' // pending hdp
    if (listGT.OverUnder.includes(gameType)) return 'bg-light-blue' // pending ou
    return 'bg-light-yellow' // pending
  }
  if (status === -1 || status === 1) if (voidID === 0) return '' // accepted
  return 'bg-light-grey' // reject
}
