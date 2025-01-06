import { Descriptions, Divider, Table, Typography } from 'antd'
import { Amount } from 'components/blaise'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import actions from 'redux/customer-list/actions'
import './custom.scss'

const { Text } = Typography

const mapStateToProps = ({ customerList }) => ({
  tableData: customerList.vipLogData,
  loadingData: customerList.loadingDrawer,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_VIP_LOG,
      payload,
      source: 'Customer List',
    })
  },
})

const columns = [
  {
    title: 'VIP Code',
    dataIndex: 'vip_code',
    align: 'center',
    width: 90,
  },
  {
    title: 'Value 1',
    dataIndex: 'default_value',
    align: 'right',
    width: 90,
    render: text => <Amount value={text} />,
  },
  {
    title: 'Value 2',
    dataIndex: 'default_value2',
    align: 'right',
    width: 90,
    render: text => <Amount value={text} />,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    align: 'center',
    width: 90,
    render: record => (
      <>
        {record === '0' && <Text>-</Text>}
        {record === '-1' && <Text className="text-danger">Remove</Text>}
        {record === '1' && <Text className="text-primary">Add</Text>}
        {record === '2' && <Text className="text-success">Update</Text>}
      </>
    ),
  },
  {
    title: 'Stamp Date',
    dataIndex: 'stamp_date',
    align: 'center',
    width: 90,
    render: record => record.formatDateTimeSecond(),
  },
  {
    title: 'Stamp User',
    dataIndex: 'stamp_user',
    align: 'center',
    width: 90,
  },
]

const VipLog = ({ editValue, Load, loadingData, tableData }) => {
  useEffect(() => {
    Load(editValue)
  }, [editValue, Load])

  const separatorHandler = (record, index) => {
    const lastIndex = tableData.findLastIndex(x => x.stamp_date === record.stamp_date)
    const isLastRow = index === lastIndex
    return {
      className: isLastRow && 'custom_border_bottom',
    }
  }

  return (
    <>
      <Descriptions size="small" column={1} bordered>
        <Descriptions.Item label="Customer ID">{editValue.customer_id}</Descriptions.Item>
        <Descriptions.Item label="Username">{editValue.username}</Descriptions.Item>
        <Descriptions.Item label="Currency">{editValue.currency}</Descriptions.Item>
      </Descriptions>
      <Divider className="my-2" />
      <Table
        rowKey={record => `${record.vip_code}-${record.stamp_date}`}
        size="small"
        loading={loadingData}
        dataSource={tableData}
        columns={columns}
        pagination={false}
        onRow={(record, rowIndex) => separatorHandler(record, rowIndex)}
      />
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(VipLog)
