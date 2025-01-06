import { FileExcelOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, Form, Select, Space } from 'antd'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import actions from 'redux/member-pending-funds/actions'
import TableBetList from './table-bet-list'
import TableBetListRunning from './table-bet-list-running'
import TableBetListSummary from './table-bet-list-summary'
import TableDailyStatement from './table-daily-statement'

const mapStateToProps = ({ memberPendingFunds }) => ({
  loadingExport: memberPendingFunds.loadingExport,
})

const mapDispatchToProps = dispatch => ({
  LoadDetail: payload => {
    dispatch({
      type: actions.LOAD_DETAIL,
      payload,
      source: 'Member Pending Funds',
    })
  },
  Export: payload => {
    dispatch({
      type: actions.EXPORT,
      payload,
      source: 'Member Pending Funds',
    })
  },
  CleanUpDetail: () => dispatch({ type: actions.CLEAN_UP_DETAIL }),
})

const reportTypeOptions = [
  { value: 0, label: 'Daily Statement' },
  { value: 1, label: 'Bet Summary' },
  { value: 2, label: 'Bet List' },
  { value: 3, label: 'Bet List Running' },
]

const { RangePicker } = DatePicker
const MemberPendingFundsDetail = ({
  detailValue,
  dateTimeBusinessHour,
  // branchOptions,
  loadingExport,
  LoadDetail,
  Export,
  CleanUpDetail,
}) => {
  React.useEffect(() => CleanUpDetail, [CleanUpDetail])

  const [form] = Form.useForm()
  const [detailSubmitValue, setDetailSubmitValue] = useState()

  React.useEffect(() => {
    form.submit()
  }, [form])

  const exportHandler = () => {
    Export({
      ...detailValue,
      ...detailSubmitValue,
    })
  }

  return (
    <>
      <Form
        form={form}
        className="w-100"
        initialValues={{
          branch: 'ALL',
          report_type: 3,
          date_range: [dateTimeBusinessHour.clone().startOf('month'), dateTimeBusinessHour],
        }}
        onFinish={values => {
          const payload = {
            ...values,
            from: values.date_range[0].format('YYYY-MM-DD'),
            to: values.date_range[1].format('YYYY-MM-DD'),
          }
          setDetailSubmitValue(payload)
          LoadDetail({
            ...detailValue,
            ...payload,
          })
        }}
      >
        <Col xs={16} sm={8} md={6} lg={6} xl={6}>
          <Form.Item label="Username">{detailValue.username}</Form.Item>
          {/* <Form.Item name="branch">
            <Select showSearch optionFilterProp="label" options={branchOptions} className="w-100" />
          </Form.Item> */}
          <Form.Item name="report_type">
            <Select
              showSearch
              optionFilterProp="label"
              options={reportTypeOptions}
              className="w-100"
            />
          </Form.Item>
          <Form.Item name="date_range">
            <RangePicker allowClear={false} format="YYYY-MM-DD" className="w-100" />
          </Form.Item>
        </Col>
        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          {[2, 3].includes(detailSubmitValue?.report_type) && (
            <Button
              type="primary"
              loading={loadingExport}
              icon={<FileExcelOutlined />}
              onClick={exportHandler}
            >
              Export
            </Button>
          )}
        </Space>
      </Form>
      {detailSubmitValue?.report_type === 0 && <TableDailyStatement formDetail={form} />}
      {detailSubmitValue?.report_type === 1 && <TableBetListSummary />}
      {detailSubmitValue?.report_type === 2 && <TableBetList />}
      {detailSubmitValue?.report_type === 3 && <TableBetListRunning />}
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(MemberPendingFundsDetail)
