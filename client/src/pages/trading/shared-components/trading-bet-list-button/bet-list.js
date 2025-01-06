import React from 'react'
import { Space, Table, Typography } from 'antd'
import { Amount, BetGameTypeColumn, BetSlip, VIPUsername } from 'components/blaise'
import { QueryBetList } from '../query'

const { Text } = Typography

const BetList = ({ record: betListValue }) => {
  const { match_id, sub_match_id, game_type, bet_choice, isMixParlay } = betListValue
  const { data = [], status } = QueryBetList({
    match_id,
    sub_match_id,
    game_type: isMixParlay ? -1 : game_type,
    bet_choice,
  })
  // React.useEffect(() => {
  //   // setViewParameter({ autoRefresh: false }) // DISABLE AUTO REFRESH ON MAIN TABLE
  //   refetch()
  // }, [refetch])

  const [getRowSpan, getRowNumber] = React.useMemo(() => {
    const isFirstRow = (bet_id, index) => {
      const firstIndex = data.findIndex(x => x.bet_id === bet_id)
      if (firstIndex === -1) return false
      if (index === firstIndex) return true
      const prev = data[index - 1]
      return prev.bet_id !== bet_id
    }
    const rowCount = bet_id => data.filter(x => x.bet_id === bet_id).length

    const uniqData = data.reduce((acc, cur) => {
      const index = acc.findIndex(x => x.bet_id === cur.bet_id)
      if (index === -1) acc.push(cur)
      return acc
    }, [])

    return [
      (bet_id, index) => {
        if (!isFirstRow(bet_id, index)) return 0
        return rowCount(bet_id)
      },
      bet_id => uniqData.findIndex(x => x.bet_id === bet_id) + 1,
    ]
  }, [data])

  const columns = React.useMemo(() => {
    return [
      {
        title: 'No',
        width: 30,
        align: 'center',
        render: (text, record) => getRowNumber(record.bet_id),
        onCell: ({ bet_id }, index) => ({
          rowSpan: getRowSpan(bet_id, index),
        }),
      },
      {
        title: 'Username',
        align: 'center',
        width: 100,
        render: record => (
          <Space direction="vertical" size={0}>
            <VIPUsername {...record} />
            {/* <Text>{getOddsTypeByOddsStatus(record.odds_type)}</Text> VISIBLE = FALSE */}
          </Space>
        ),
        onCell: ({ bet_id }, index) => ({
          rowSpan: getRowSpan(bet_id, index),
        }),
      },
      {
        title: 'Bet ID',
        align: 'center',
        width: 100,
        render: record => (
          <Space direction="vertical" size={0}>
            {record.bet_id !== 0 && record.bet_id}
            {record.bet_type === 'WML' && <Text className="text-danger">(Mobile)</Text>}
            {record.bet_type === 'BUY' && <Text className="text-danger">({record.company})</Text>}
            {record.pending_bet_id !== 0 && (
              <Text className="text-success">{`(P${record.pending_bet_id})`}</Text>
            )}
          </Space>
        ),
        onCell: ({ bet_id }, index) => ({
          rowSpan: getRowSpan(bet_id, index),
        }),
      },
      {
        title: 'Bet Date',
        align: 'center',
        width: 100,
        render: record => (
          <Space direction="vertical" size={0}>
            {record.bet_date.formatDate()}
            {record.bet_date.formatTimeSecond()}
          </Space>
        ),
        onCell: ({ bet_id }, index) => ({
          rowSpan: getRowSpan(bet_id, index),
        }),
      },
      {
        title: 'Game Type',
        align: 'center',
        width: 100,
        render: record => <BetGameTypeColumn {...record} />,
        onCell: ({ bet_id }, index) => ({
          rowSpan: getRowSpan(bet_id, index),
        }),
      },
      {
        title: 'Bet Slip',
        align: 'right',
        width: 200,
        render: record => <BetSlip {...record} />,
      },
      {
        title: 'Currency',
        dataIndex: 'currency',
        align: 'center',
        width: 80,
        onCell: ({ bet_id }, index) => ({
          rowSpan: getRowSpan(bet_id, index),
        }),
      },
      {
        title: 'Stake (F/L)',
        align: 'right',
        width: 80,
        render: record => {
          return (
            <Space direction="vertical" size={0}>
              <Amount value={record.bet_amount} />
              {record.game_type === -1 && record.tickets !== 1 ? (
                <Text className="font-weight-bold">
                  @<Amount value={record.bet_amount / record.tickets} />
                </Text>
              ) : (
                <></>
              )}
              <Amount value={record.bet_amount_rmb} keepMinus={false} mc />
            </Space>
          )
        },
        onCell: ({ bet_id }, index) => ({
          rowSpan: getRowSpan(bet_id, index),
        }),
      },
      {
        title: 'Result (F/L)',
        align: 'right',
        width: 80,
        render: record => {
          if (record.void_id && record.void_id !== '0') {
            return (
              <Space direction="vertical" size={0}>
                <Text className="text-danger">{record.void_desc}</Text>
                <Text>by {record.void_user}</Text>
              </Space>
            )
          }
          if (record.winloss_status === '') {
            return (
              <Space size={1}>
                -<Text className="text=primary">-</Text>
              </Space>
            )
          }
          return (
            <Space direction="vertical" size={0}>
              <Amount value={record.winloss_amount} keepMinus={false} />
              <Amount value={record.winloss_amount_rmb} keepMinus={false} mc />
            </Space>
          )
        },
        onCell: ({ bet_id }, index) => ({
          rowSpan: getRowSpan(bet_id, index),
        }),
      },
      {
        title: 'Stock',
        align: 'right',
        width: 80,
        render: record => {
          if (record.void_id && record.void_id !== '0') return 0
          return <Amount value={record.bet_amount_comp} />
        },
        onCell: ({ bet_id }, index) => ({
          rowSpan: getRowSpan(bet_id, index),
        }),
      },
      {
        title: 'IP',
        dataIndex: 'ip',
        align: 'center',
        width: 90,
        onCell: ({ bet_id }, index) => ({
          rowSpan: getRowSpan(bet_id, index),
        }),
      },
    ]
  }, [getRowNumber, getRowSpan])

  return (
    <Table
      id="table-bet-detail"
      bordered
      loading={status === 'loading'}
      size="small"
      rowKey={record => `${record.bet_id}-${record.league_name}`}
      dataSource={data}
      columns={columns}
      pagination={false}
      rowClassName={record => record.void_id && record.void_id !== '0' && 'bg-void-ticket'}
      summary={() => {
        const dataSummary = {
          stake: countTotal('bet_amount_rmb', data),
          result: countTotal('winloss_amount_rmb', data),
          company_stock: countTotal('bet_amount_comp', data),
        }
        return (
          <Table.Summary.Row className="font-weight-bold" align="right">
            <Table.Summary.Cell colSpan={7} align="center">
              Total
            </Table.Summary.Cell>
            <Table.Summary.Cell>
              <Amount className="text-blue" value={dataSummary.stake} />
              {/* <Amount value={totalStake} mc /> */}
            </Table.Summary.Cell>
            <Table.Summary.Cell>
              <Amount className="text-blue" value={dataSummary.result} />
            </Table.Summary.Cell>
            <Table.Summary.Cell>
              <Amount className="text-blue" value={dataSummary.company_stock} />
            </Table.Summary.Cell>
            <Table.Summary.Cell />
          </Table.Summary.Row>
        )
      }}
    />
  )
}

export default BetList

const countTotal = (params, data) => {
  const uniqData = data.reduce((acc, cur) => {
    const index = acc.findIndex(x => x.bet_id === cur.bet_id)
    if (index === -1) acc.push(cur)
    return acc
  }, [])

  return uniqData.reduce((acc, curr) => {
    if (curr.void_id || curr.bet_id === 0) return acc
    if (params === 'winloss_amount_rmb' && curr.winloss_status === '') acc += 0
    else acc += curr[params]
    return acc
  }, 0)
}
