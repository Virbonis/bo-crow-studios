import { Table } from 'antd'
import { Amount } from 'components/blaise'
import { getBetChoice } from 'helper'
import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = ({ memberPendingFunds }) => ({
  loading: memberPendingFunds.loadingDetail,
  tableData: memberPendingFunds.betSummaryData,
})

const TableBetListSummary = ({ loading, tableData }) => {
  const columns = [
    {
      title: 'Event Date',
      dataIndex: 'event_date',
      width: 120,
    },
    {
      title: 'Event',
      width: 120,
      render: ({ home_name, away_name }) => `${home_name} - ${away_name}`,
    },
    {
      title: 'Choice',
      width: 120,
      render: ({ bet_choice, home_name, away_name }) =>
        `${bet_choice} ${getBetChoice(bet_choice, home_name, away_name)}`,
    },
    {
      title: 'Stake',
      dataIndex: 'bet_amount',
      align: 'right',
      width: 120,
      render: text => <Amount value={text} />,
    },
    {
      title: 'Winning',
      dataIndex: 'win_loss',
      align: 'right',
      width: 120,
      render: text => <Amount value={text} />,
    },
  ]

  return (
    <Table
      rowKey={record => `${record.bet_id}-${record.match_id}-${record.bet_choice}}`}
      bordered
      size="small"
      loading={loading}
      dataSource={tableData}
      columns={columns}
      pagination={false}
    />
  )
}

export default connect(mapStateToProps)(TableBetListSummary)
