import React, { useEffect } from 'react'
import { Descriptions, Table } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/fund-transfer/actions'
import { Amount } from 'components/blaise'

const mapStateToProps = ({ fundTransfer }) => ({
  loading: fundTransfer.loadingDetail,
  tableData: fundTransfer.detailData,
})

const mapDispatchToProps = dispatch => ({
  LoadDetail: payload => {
    dispatch({
      type: actions.LOAD_DETAIL,
      payload,
      source: 'Fund Transfer',
    })
  },
})

const columns = [
  {
    title: 'Trans Date',
    align: 'center',
    dataIndex: 'tran_date',
    width: 120,
    render: text => text.formatDateTimeSecond(),
  },
  {
    title: 'Fund Type',
    align: 'center',
    dataIndex: 'fund_type_desc',
    width: 120,
  },
  {
    title: 'Currency',
    align: 'center',
    dataIndex: 'currency',
    width: 120,
  },
  {
    title: 'Amount',
    align: 'right',
    dataIndex: 'amount',
    width: 120,
    render: text => <Amount value={text} />,
  },
  {
    title: 'Start Balance',
    align: 'right',
    dataIndex: 'start_balance',
    width: 120,
    render: text => <Amount value={text} />,
  },
  {
    title: 'End Balance',
    align: 'right',
    dataIndex: 'end_balance',
    width: 120,
    render: text => <Amount value={text} />,
  },
  {
    title: 'Status',
    align: 'center',
    dataIndex: 'status_desc',
    width: 120,
  },
]
const BreakdownReportDetail = ({ detailValue, tableData, loading, LoadDetail }) => {
  useEffect(() => {
    LoadDetail(detailValue)
  }, [LoadDetail, detailValue])

  return (
    <>
      <Descriptions size="small" column={2} bordered>
        <Descriptions.Item label="From Date">{detailValue.from_date}</Descriptions.Item>
        <Descriptions.Item label="Username">{detailValue.username}</Descriptions.Item>
        <Descriptions.Item label="To Date">{detailValue.to_date}</Descriptions.Item>
      </Descriptions>
      <Table
        bordered
        size="small"
        rowKey={record => `${record.tran_date}${record.fund_type_desc}`}
        loading={loading}
        columns={columns}
        dataSource={tableData}
        pagination={false}
      />
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(BreakdownReportDetail)
