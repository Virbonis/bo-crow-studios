import React from 'react'
import { Space, Table, Typography } from 'antd'
import { Amount, BetGameTypeColumn, BetSlip } from 'components/blaise'
import { getOddsTypeDescByOddsType } from 'helper'
import '../shared-components/table-bet-detail.scss'

const { Text } = Typography
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
      align: 'center',
      width: 30,
      render: (text, record) => getRowNumber(record.bet_id),
      onCell: ({ bet_id, match_id }) => ({
        rowSpan: getRowSpan(bet_id, match_id),
      }),
    },
    {
      title: 'Username\nBet ID\nBet Date',
      align: 'center',
      width: 150,
      render: (text, record) => {
        return (
          <Space direction="vertical" size={0}>
            {record.username}
            <Text strong>{record.bet_id}</Text>
            {record.bet_date.formatDateTimeSecond()}
          </Space>
        )
      },
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
      width: 80,
      render: record => <BetGameTypeColumn {...record} />,
      onCell: ({ bet_id, match_id }) => ({
        rowSpan: getRowSpan(bet_id, match_id),
      }),
    },
    {
      title: 'Bet Slip',
      align: 'right',
      width: 200,
      render: (text, record) => <BetSlip {...record} />,
    },
    {
      title: 'Odds',
      dataIndex: 'odds',
      align: 'center',
      width: 80,
      render: (text, record) => {
        return (
          <>
            <Amount length={3} value={text} />
            <br />
            {getOddsTypeDescByOddsType(record.odds_type)}
          </>
        )
      },
      onCell: ({ bet_id, match_id }) => ({
        rowSpan: getRowSpan(bet_id, match_id),
      }),
    },
    {
      title: 'Stake',
      dataIndex: 'bet_amount',
      align: 'center',
      width: 80,
      render: (text, record) => {
        return (
          <>
            <Amount value={text} />
            <br />
            <Amount value={record.loss_amount} />
          </>
        )
      },
      onCell: ({ bet_id, match_id }) => ({
        rowSpan: getRowSpan(bet_id, match_id),
      }),
    },
    {
      title: 'Status',
      dataIndex: 'win_loss_status',
      align: 'center',
      width: 80,
      render: (text, record) => {
        let status = ''
        if (text === 'W') status = 'Win'
        if (text === 'D') status = 'Draw'
        if (text === 'L') status = <Text type="danger">Loss</Text>
        return (
          <>
            {status}
            <br />
            {record.game_type !== -1 && (
              <>
                HT {record.ht_home} - {record.ht_away} <br />
                FT {record.fs_home} - {record.fs_away}
              </>
            )}
          </>
        )
      },
      onCell: ({ bet_id, match_id }) => ({
        rowSpan: getRowSpan(bet_id, match_id),
      }),
    },
    {
      title: 'Member Winloss/Comm',
      align: 'right',
      width: 100,
      render: (text, record) => {
        return (
          <>
            <Amount value={record.win_member - record.comm_amt_member} />
            <br />
            <Amount value={record.comm_amt_member} />
          </>
        )
      },
      onCell: ({ bet_id, match_id }) => ({
        rowSpan: getRowSpan(bet_id, match_id),
      }),
    },
    {
      title: 'Agent Winloss/Comm',
      align: 'right',
      width: 100,
      render: (text, record) => {
        return (
          <>
            <Amount value={record.win_agent} />
            <br />
            <Amount value={record.comm_amt_agent} />
          </>
        )
      },
      onCell: ({ bet_id, match_id }) => ({
        rowSpan: getRowSpan(bet_id, match_id),
      }),
    },
    {
      title: 'MA Winloss/Comm',
      align: 'right',
      width: 100,
      render: (text, record) => {
        return (
          <>
            <Amount value={record.win_ma} />
            <br />
            <Amount value={record.comm_amt_ma} />
          </>
        )
      },
      onCell: ({ bet_id, match_id }) => ({
        rowSpan: getRowSpan(bet_id, match_id),
      }),
    },
    {
      title: 'SMA Winloss/Comm',
      align: 'right',
      width: 100,
      render: (text, record) => {
        return (
          <>
            <Amount value={record.win_sma} />
            <br />
            <Amount value={record.comm_amt_sma} />
          </>
        )
      },
      onCell: ({ bet_id, match_id }) => ({
        rowSpan: getRowSpan(bet_id, match_id),
      }),
    },
    {
      title: 'SSMA Winloss/Comm',
      align: 'right',
      width: 100,
      render: (text, record) => {
        return (
          <>
            <Amount value={record.win_ssma} />
            <br />
            <Amount value={record.comm_amt_ssma} />
          </>
        )
      },
      onCell: ({ bet_id, match_id }) => ({
        rowSpan: getRowSpan(bet_id, match_id),
      }),
    },
    {
      title: 'Company Winloss/Comm',
      align: 'right',
      width: 100,
      render: (text, record) => {
        return (
          <>
            <Amount value={record.win_company} />
            <br />
            <Amount value={record.comm_amt_company} />
          </>
        )
      },
      onCell: ({ bet_id, match_id }) => ({
        rowSpan: getRowSpan(bet_id, match_id),
      }),
    },
    {
      title: 'Company PT \nSSMA PT\nSMA PT\nMA PT\nAgent PT',
      align: 'right',
      width: 100,
      render: record => {
        return (
          <>
            {record.share_company} %<br />
            {record.share_ssma} %<br />
            {record.share_sma} %<br />
            {record.share_ma} %<br />
            {record.share_agent} %<br />
          </>
        )
      },
      onCell: ({ bet_id, match_id }) => ({
        rowSpan: getRowSpan(bet_id, match_id),
        style: {
          backgroundColor: 'pink',
        },
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
