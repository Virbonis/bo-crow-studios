import React from 'react'
import { Table } from 'antd'
import { Amount, BetGameTypeColumn, BetSlip } from 'components/blaise'
import '../shared-components/table-bet-detail.scss'

const TableDetail = React.memo(({ dataSource, ...restProps }) => {
  const [getRowSpan, getRowNumber] = React.useMemo(() => {
    const isFirstRow = (bet_id, match_id) => {
      const index = dataSource.findIndex(x => x.bet_id === bet_id && x.match_id === match_id)
      if (index === -1) return false
      if (index === 0) return true
      const prev = dataSource[index - 1]
      return prev.bet_id !== bet_id
    }
    const rowCount = bet_id => dataSource.filter(x => x.bet_id === bet_id).length

    const uniqData = dataSource.reduce((acc, cur) => {
      const index = acc.findIndex(x => x.bet_id === cur.bet_id)
      if (index === -1) acc.push(cur)
      return acc
    }, [])

    return [
      (bet_id, match_id) => {
        if (!isFirstRow(bet_id, match_id)) return 0
        return rowCount(bet_id)
      },
      bet_id => uniqData.findIndex(x => x.bet_id === bet_id) + 1,
    ]
  }, [dataSource])

  const columnDetail = [
    {
      title: 'No',
      width: 30,
      render: (text, record) => getRowNumber(record.bet_id),
      onCell: ({ bet_id, match_id }) => ({
        rowSpan: getRowSpan(bet_id, match_id),
      }),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      align: 'center',
      width: 120,
      onCell: ({ bet_id, match_id }) => ({
        rowSpan: getRowSpan(bet_id, match_id),
      }),
    },
    {
      title: 'Bet ID',
      dataIndex: 'bet_id',
      align: 'center',
      width: 100,
      onCell: ({ bet_id, match_id }) => ({
        rowSpan: getRowSpan(bet_id, match_id),
      }),
    },
    {
      title: 'Bet Date',
      dataIndex: 'bet_date',
      align: 'center',
      width: 100,
      render: text => text.formatDateTimeSecond(),
      onCell: ({ bet_id, match_id }) => ({
        rowSpan: getRowSpan(bet_id, match_id),
      }),
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      align: 'center',
      width: 80,
      onCell: ({ bet_id, match_id }) => ({
        rowSpan: getRowSpan(bet_id, match_id),
      }),
    },
    {
      title: 'Game Type',
      align: 'center',
      width: 100,
      render: record => <BetGameTypeColumn {...record} />,
      onCell: ({ bet_id, match_id }) => ({
        rowSpan: getRowSpan(bet_id, match_id),
      }),
    },
    {
      title: 'Bet Slip',
      align: 'right',
      width: 250,
      render: (text, record) => <BetSlip {...record} />,
    },
    {
      title: 'Stake',
      dataIndex: 'bet_amount',
      render: (text, record) => {
        let info
        if (record.game_type === -1 && record.tickets !== 1) {
          const val = record.bet_amount / record.tickets
          info = (
            <>
              <br />
              @<Amount bold value={val} />
            </>
          )
        }
        return (
          <>
            <Amount value={text} />
            {info}
          </>
        )
      },
      align: 'right',
      width: 80,
      onCell: ({ bet_id, match_id }) => ({
        rowSpan: getRowSpan(bet_id, match_id),
      }),
    },

    {
      title: 'Stake (L)',
      dataIndex: 'bet_amount_rmb',
      render: text => <Amount value={text} />,
      align: 'right',
      width: 80,
      onCell: ({ bet_id, match_id }) => ({
        rowSpan: getRowSpan(bet_id, match_id),
      }),
    },
    {
      title: 'Result (F)',
      dataIndex: 'winloss_amount',
      render: text => <Amount value={text} />,
      align: 'right',
      width: 80,
      onCell: ({ bet_id, match_id }) => ({
        rowSpan: getRowSpan(bet_id, match_id),
      }),
    },
    {
      title: 'Result (L)',
      dataIndex: 'winloss_amount_rmb',
      render: text => <Amount value={text} />,
      align: 'right',
      width: 80,
      onCell: ({ bet_id, match_id }) => ({
        rowSpan: getRowSpan(bet_id, match_id),
      }),
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      align: 'center',
      width: 100,
      onCell: ({ bet_id, match_id }) => ({
        rowSpan: getRowSpan(bet_id, match_id),
      }),
    },
  ]

  return (
    <Table
      id="table-bet-detail"
      rowKey={record => `${record.bet_id}-${record.match_id}`}
      style={{ whiteSpace: 'break-spaces' }}
      columns={columnDetail}
      dataSource={dataSource}
      {...restProps}
    />
  )
})

export default TableDetail
