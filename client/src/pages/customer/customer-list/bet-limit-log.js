import { Descriptions, Divider, Table } from 'antd'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import actions from 'redux/customer-list/actions'

const mapStateToProps = ({ customerList }) => ({
  tableData: customerList.betLimitLogData,
  loadingData: customerList.loadingDrawer,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_BET_LIMIT_LOG,
      payload,
      source: 'Customer List',
    })
  },
})

const columns = [
  {
    title: 'Old Value',
    dataIndex: 'old_value',
    width: 100,
  },
  {
    title: 'New Value',
    dataIndex: 'new_value',
    width: 100,
  },
  {
    title: 'Stamp Date',
    dataIndex: 'stamp_date',
    width: 100,
    render: text => text.formatDateTimeSecond(),
  },
  {
    title: 'Stamp User',
    dataIndex: 'stamp_user',
    width: 100,
  },
]

const BetLimitLog = ({ editValue, Load, loadingData, tableData }) => {
  useEffect(() => {
    Load(editValue)
  }, [editValue, Load])

  return (
    <>
      <Descriptions size="small" column={1} bordered>
        <Descriptions.Item label="Customer ID">{editValue.customer_id}</Descriptions.Item>
        <Descriptions.Item label="Username">{editValue.username}</Descriptions.Item>
        <Descriptions.Item label="Currency">{editValue.currency}</Descriptions.Item>
      </Descriptions>
      <Divider className="my-2" />
      <Table
        rowKey={record => record.stamp_date}
        size="small"
        loading={loadingData}
        dataSource={tableData}
        columns={columns}
        pagination={false}
      />
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(BetLimitLog)
