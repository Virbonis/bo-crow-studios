import React from 'react'
import { ConfigProvider, Table, Typography } from 'antd'
import { getGameTypeDescriptionShort, getOddsTypeDescByOddsType } from 'helper'
import { Amount, VIPUsername } from 'components/blaise'

const TableBetListCS = ({ loading, data = [] }) => {
  const columns = [
    {
      title: 'No',
      render: (_, __, index) => index + 1,
      width: 30,
    },
    {
      title: 'Bet ID',
      render: record => (record.bet_id !== 0 ? record.bet_id : `(P${record.pending_bet_id})`),
    },
    {
      title: 'Username',
      render: record => <VIPUsername username={record.username} vip_code={record.vip_code} />,
    },
    {
      title: 'Run',
      render: record =>
        record.st_live === 'N' ? '' : `${record.bet_score_home}-${record.bet_score_away}`,
      width: 45,
    },
    {
      title: 'Type',
      dataIndex: 'game_type',
      render: text => getGameTypeDescriptionShort(text),
      width: 45,
    },
    {
      title: 'Choice',
      dataIndex: 'bet_choice',
      width: 100,
    },
    {
      title: <span title="Odds Type">OT</span>,
      render: record => getOddsTypeDescByOddsType(record.odds_type).charAt(0),
      width: 44,
    },
    {
      title: 'Odds',
      dataIndex: 'odds',
      render: text => <Amount value={text} />,
      width: 50,
    },
    { title: 'Currency', dataIndex: 'currency', width: 75 },
    {
      title: 'C. Amt',
      dataIndex: 'bet_amount_comp',
      render: text => <Amount value={text} title={text} />,
      width: 55,
    },
    {
      title: 'Amt',
      dataIndex: 'bet_amount_rmb',
      render: text => <Amount value={text} className="text-magenta" bold title={text} />,
      width: 50,
    },
    {
      title: 'DateTime',
      dataIndex: 'bet_date',
      render: text => text.formatDateTimeSecond(),
    },
  ]

  return (
    <>
      <Typography.Title level={5}>
        {data[0]?.home_name} - {data[0]?.away_name}
      </Typography.Title>
      <ConfigProvider renderEmpty={() => null}>
        <Table
          size="small"
          loading={loading}
          columns={columns}
          dataSource={data}
          rowKey={record => `${record.bet_id}${record.pending_bet_id}`}
          onRow={record => ({
            className: record.void_id ? 'text-red' : '',
          })}
          pagination={false}
        />
      </ConfigProvider>
    </>
  )
}

export default TableBetListCS
