import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Table } from 'antd'
import actions from 'redux/cash-limit-profile/actions'
import { Amount } from 'components/blaise'
import { priceGroupName } from 'helper'

const mapStateToProps = ({ cashLimitProfile }) => ({
  tableData: cashLimitProfile.dataLog,
})

const mapDispatchToProps = dispatch => ({
  LoadLog: payload => {
    dispatch({
      type: actions.LOAD_LOG,
      payload,
      source: 'Log Cash Limit Profile',
    })
  },
})

const LogCashLimitProfile = ({ tableData, LoadLog, logValue }) => {
  useEffect(() => {
    LoadLog(logValue)
  }, [LoadLog, logValue])

  const columns = [
    {
      title: 'League Group',
      dataIndex: 'league_group',
      render: text => priceGroupName[text],
    },
    {
      title: 'Sport',
      dataIndex: 'sport',
    },
    {
      title: 'Min Bet',
      dataIndex: 'min_bet',
      render: text => <Amount value={text} int />,
      align: 'right',
    },
    {
      title: 'Max Bet',
      dataIndex: 'max_bet',
      render: text => <Amount value={text} int />,
      align: 'right',
    },
    {
      title: 'Match Limit / Max Payout',
      dataIndex: 'match_limit',
      render: text => <Amount value={text} int />,
      align: 'right',
    },
    {
      title: 'Stamp Date',
      dataIndex: 'stamp_date',
    },
    {
      title: 'Stamp User',
      dataIndex: 'stamp_user',
    },
    {
      title: 'Desc',
      dataIndex: 'desc',
    },
  ]
  return (
    <>
      <Table
        size="small"
        rowKey={record => `${record.league_group$}${record.sport}${record.stamp_date}`}
        dataSource={tableData}
        columns={columns}
        pagination={false}
      />
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(LogCashLimitProfile)
