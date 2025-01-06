import React, { useEffect } from 'react'
import { Table } from 'antd'
import actions from 'redux/sis/actions'
import { connect } from 'react-redux'
import { columns } from '../sis-market-log'

const mapStateToProps = ({ sis }) => ({
  loadingTable: sis.loadingDetail,
  dataTable: sis.data_action_log_detail,
})

const mapDispatchToProps = dispatch => ({
  LoadDetail: payload => {
    dispatch({
      type: actions.LOAD_ACTION_LOG_DETAIL,
      payload,
      source: 'SIS ACTION LOG DETAIL',
    })
  },
  CleanUpDetail: () => dispatch({ type: actions.CLEAN_UP_ACTION_LOG_DETAIL }),
})

const DetailActionLog = ({ detailValue, loadingTable, dataTable, LoadDetail, CleanUpDetail }) => {
  React.useEffect(() => CleanUpDetail, [CleanUpDetail])
  useEffect(() => {
    LoadDetail({ ...detailValue, game_type: -99 })
  }, [LoadDetail, detailValue])

  return (
    <Table
      rowKey={record => `${record.log_date}-${record.log_game_type}-${record.log_line}`}
      loading={loadingTable}
      dataSource={dataTable}
      columns={columns}
      pagination={false}
    />
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailActionLog)
