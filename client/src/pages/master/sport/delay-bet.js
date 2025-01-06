import React from 'react'
import { connect } from 'react-redux'
import { Table } from 'antd'
import action from 'redux/sport/actions'

const mapStateToProps = ({ sport }) => ({
  data: sport.dataDelayBet,
  loading: sport.loadingDelayBet,
})

const mapDispatchToProps = dispatch => ({
  LoadDelayBetMasterSport: payload => {
    dispatch({
      type: action.LOAD_DELAY_BET,
      payload,
      source: 'Master Sport',
    })
  },
})

const column = [
  {
    title: 'Customer ID',
    dataIndex: 'customer_id',
  },
  {
    title: 'Branch',
    dataIndex: 'branch_name',
  },
  {
    title: 'Username',
    dataIndex: 'user_name',
  },
  {
    title: 'Currency',
    dataIndex: 'currency',
  },
  {
    title: 'Early',
    dataIndex: 'early_delay',
  },
  {
    title: 'Today',
    dataIndex: 'today_delay',
  },
  {
    title: 'Live',
    dataIndex: 'live_delay',
  },
]
const DelayBetMasterSport = ({ initialValue, data, loading, LoadDelayBetMasterSport }) => {
  React.useEffect(() => {
    LoadDelayBetMasterSport(initialValue)
  }, [initialValue, LoadDelayBetMasterSport])
  return (
    <>
      <Table loading={loading} columns={column} dataSource={data} pagination={false} />
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(DelayBetMasterSport)
