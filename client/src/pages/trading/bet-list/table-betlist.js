import React from 'react'
import { Table } from 'antd'
import { getGameTypeDescriptionShort, getOddsTypeDescByOddsType } from 'helper'
import { Amount, HDPColumn, VIPUsername } from 'components/blaise'

const TableBetList = ({ loading, data = [], is1X2, setTotal }) => {
  const columns = React.useMemo(
    () => [
      {
        title: 'No',
        align: 'center',
        render: (_, __, index) => index + 1,
        width: 30,
      },
      {
        title: 'Bet ID',
        align: 'center',
        render: record => (record.bet_id !== 0 ? record.bet_id : `(P${record.pending_bet_id})`),
        width: 80,
      },
      {
        title: 'Username',
        render: record => <VIPUsername username={record.username} vip_code={record.vip_code} />,
        width: 115,
      },
      {
        title: 'Run',
        align: 'center',
        render: record =>
          record.bet_live_status === 'N' ? '' : `${record.bet_score_home}-${record.bet_score_away}`,
        width: 35,
      },
      {
        title: 'Type',
        dataIndex: 'game_type',
        render: text => getGameTypeDescriptionShort(text),
        width: 45,
      },
      ...(!is1X2
        ? [
            {
              title: 'HDP',
              align: 'center',
              render: record => <HDPColumn {...record} />,
              width: 40,
            },
            {
              title: <span title="Odds Type">OT</span>,
              render: record => getOddsTypeDescByOddsType(record.odds_type).charAt(0),
              width: 30,
            },
          ]
        : []),
      {
        title: 'Odds',
        dataIndex: 'odds',
        render: text => <Amount value={text} />,
        width: 40,
      },
      {
        title: 'Curr.',
        dataIndex: 'currency',
        align: 'center',
        width: 45,
      },
      {
        title: 'C. Amt',
        dataIndex: 'bet_amount_comp',
        render: text => <Amount value={text} title={text} />,
        align: 'right',
        width: 50,
      },
      {
        title: 'Amt',
        dataIndex: 'bet_amount_rmb',
        render: text => <Amount value={text} className="text-magenta" bold title={text} />,
        align: 'right',
        width: 45,
      },
      {
        title: 'DateTime',
        dataIndex: 'bet_date',
        align: 'center',
        render: text => text.formatDateTimeSecond(),
        width: is1X2 ? 80 : 110,
      },
    ],
    [is1X2],
  )

  const total = React.useMemo(() => getTotal(data), [data])
  React.useEffect(() => {
    if (!is1X2) setTotal(total)
  }, [total, setTotal, is1X2])

  return (
    <>
      <Table
        id="table-bet-listing"
        size="small"
        loading={loading}
        columns={columns}
        dataSource={data}
        rowKey={record => `${record.bet_id}${record.pending_bet_id}`}
        onRow={record => ({
          className: record.void_id ? 'bg-void-ticket text-red' : '',
        })}
        pagination={false}
        scroll={{
          y: true, // style height/min-height in css .table-bet-listing
        }}
        summary={() => {
          return (
            <Table.Summary fixed>
              <Table.Summary.Row align="right" className="font-weight-bold">
                <Table.Summary.Cell colSpan={!is1X2 ? 9 : 7} align="right">
                  Total C.Amt
                </Table.Summary.Cell>
                <Table.Summary.Cell colSpan={1} align="right">
                  <Amount value={total} />
                </Table.Summary.Cell>
                <Table.Summary.Cell colSpan={2} />
              </Table.Summary.Row>
            </Table.Summary>
          )
        }}
      />
    </>
  )
}

const getTotal = data => {
  if (data.length === 0) return 0

  return data.reduce((prev, item) => {
    if (item.void_id || item.bet_id === 0) return prev
    return prev + item.bet_amount_comp
  }, 0)
}

export default TableBetList
