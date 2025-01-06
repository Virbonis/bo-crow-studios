import React from 'react'
import {
  Checkbox,
  DatePicker,
  Form,
  Input,
  Select,
  Table,
  Row,
  Col,
  Button,
  Popover,
  Space,
  Tooltip,
} from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/bet-request-info/actions'
import AutoSizer from 'react-virtualized-auto-sizer'
import { Amount, useGetDateTimeDBServer } from 'components/blaise'
import { InfoCircleTwoTone } from '@ant-design/icons'
import { validatorNumeric } from 'helper'

const mapStateToProps = ({ betRequestInfo }) => ({
  dataTable: betRequestInfo.data,
  loading: betRequestInfo.loading,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Bet Request Info',
    })
  },
})

const { RangePicker } = DatePicker
const betStatusOptions = [
  { value: '-1', label: 'All Bet Status' },
  { value: '1', label: 'Success' },
  { value: '0', label: 'No Ticket' },
  { value: '2', label: 'Failed' },
]
const betConfirmOptions = [
  { value: '-1', label: 'All Bet Confirm Status' },
  { value: '1', label: 'Success' },
  { value: '0', label: 'Failed' },
  { value: '2', label: 'Cancelled' },
  { value: '3', label: 'Wait for response' },
]
const payoutStatusOptions = [
  { value: '-1', label: 'All Payout Status' },
  { value: '1', label: 'Success' },
  { value: '0', label: 'Unsettled' },
]
const payoutConfirmOptions = [
  { value: '-1', label: 'All Payout Confirm Status' },
  { value: '1', label: 'Success' },
  { value: '0', label: 'UnConfirmed' },
]
const unprocessStatusOptions = [
  { value: '-1', label: 'All Unprocess Status' },
  { value: '1', label: 'Success' },
  { value: '0', label: 'Waiting' },
]
const unprocessConfirmOptions = [
  { value: '-1', label: 'All Unprocess Status' },
  { value: '1', label: 'Success' },
  { value: '0', label: 'UnConfirmed' },
]

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeDBServer()

  if (!defaultDateTime) return null

  return <Component {...props} defaultDateTime={defaultDateTime} />
}

const columns = [
  {
    title: 'Request ID',
    dataIndex: 'request_id',
    width: 150,
    fixed: 'left',
  },
  {
    title: 'Request Date',
    dataIndex: 'request_date',
    render: text => text && text.formatDateTimeSecond(),
    width: 100,
    fixed: 'left',
    align: 'center',
  },
  {
    title: 'User Login',
    dataIndex: 'user_login',
    width: 100,
  },
  {
    title: 'Member ID',
    dataIndex: 'member_id',
    width: 120,
  },
  {
    title: 'Total Bet Amount',
    dataIndex: 'total_bet_amount',
    render: text => <Amount value={text} />,
    width: 75,
    align: 'right',
  },
  {
    title: 'Confirm ID',
    dataIndex: 'confirm_id',
    width: 90,
  },
  {
    title: 'Bet',
    children: [
      {
        title: 'ID',
        dataIndex: 'bet_id',
        width: 75,
      },
      {
        title: 'Type',
        dataIndex: 'bet_type',
        width: 75,
      },
      {
        title: 'Status',
        width: 75,
        render: ({ bet_status, bet_ret_val }) => {
          let betStatusText = 'Failed'
          if (bet_status === 1) betStatusText = 'Success'
          if (bet_status === 0) betStatusText = 'No Ticket Created'

          let errMessage = bet_ret_val
          if (bet_status === -1) {
            if (bet_ret_val.charAt(0) === '3') errMessage = 'Odds Change'
            if (bet_ret_val.charAt(0) === '9') errMessage = bet_ret_val.substring(1)
          }
          return (
            <>
              {betStatusText}
              {bet_status === -1 && (
                <Popover content={errMessage} placement="right">
                  <InfoCircleTwoTone className="p-1" />
                </Popover>
              )}
            </>
          )
        },
      },
      {
        title: 'Date',
        dataIndex: 'bet_stamp_date',
        width: 75,
        render: text => text && text.formatDateTimeSecond(),
        align: 'center',
      },
      {
        title: 'Confirm',
        width: 75,
        render: ({ bet_confirm, last_error = '' }) => {
          let betConfirmText = ''
          if (bet_confirm === 1) betConfirmText = 'Success'
          if (bet_confirm === 99) betConfirmText = 'Failed'
          if (bet_confirm === -1) betConfirmText = 'Canceled'
          if (bet_confirm === 0) betConfirmText = 'Wait for response'

          return (
            <>
              {betConfirmText}
              {bet_confirm !== 0 && (
                <Popover content={last_error} placement="right">
                  <InfoCircleTwoTone className="p-1" />
                </Popover>
              )}
            </>
          )
        },
      },
      {
        title: 'Confirm Date',
        dataIndex: 'bet_confirm_date',
        width: 75,
        render: text => text && text.formatDateTimeSecond(),
        align: 'center',
      },
    ],
  },
  {
    title: 'Payout',
    children: [
      {
        title: 'Status',
        dataIndex: 'payout_status',
        width: 75,
        render: (text, record) => {
          if (record.bet_confirm === 99) return ''
          if (text === 1) return 'Success'
          if (text === 0) return 'Unsettled'
          return text
        },
      },
      {
        title: 'Date',
        dataIndex: 'payout_stamp_date',
        width: 75,
        render: text => text && text.formatDateTimeSecond(),
        align: 'center',
      },
      {
        title: 'Confirm',
        dataIndex: 'payout_confirm',
        width: 75,
        render: text => {
          if (text === 1) return 'Success'
          if (text === 0) return ''
          return text
        },
      },
      {
        title: 'Confirm Date',
        dataIndex: 'payout_confirm_date',
        width: 75,
        render: text => text && text.formatDateTimeSecond(),
        align: 'center',
      },
    ],
  },
  {
    title: 'UnProcessed',
    children: [
      {
        title: 'Status',
        dataIndex: 'unsettled_status',
        width: 75,
        render: text => {
          if (text === 1) return 'Ok'
          if (text === 0) return ''
          return text
        },
      },
      {
        title: 'Date',
        dataIndex: 'unsettled_stamp_date',
        width: 75,
        render: text => text && text.formatDateTimeSecond(),
        align: 'center',
      },
      {
        title: 'Confirm',
        dataIndex: 'unsettled_confirm',
        width: 75,
        render: text => {
          if (text === 1) return 'Ok'
          if (text === 0) return ''
          return text
        },
      },
      {
        title: 'Confirm Date',
        dataIndex: 'unsettled_confirm_date',
        width: 75,
        render: text => text && text.formatDateTimeSecond(),
        align: 'center',
      },
    ],
  },
]

const BetRequestInfo = wrapperDate(({ defaultDateTime, dataTable, loading, Load }) => {
  const [form] = Form.useForm()

  return (
    <>
      <div className="card">
        <div className="card-header">
          <Form
            form={form}
            initialValues={{
              request_date: [defaultDateTime.clone().startOf('day'), defaultDateTime],
              bet_status: '-1',
              payout_status: '-1',
              unprocess_status: '-1',
              bet_confirm: '-1',
              payout_confirm: '-1',
              unprocess_confirm: '-1',
            }}
            onFinish={values => {
              Load({
                ...values,
                date_from: values.request_date?.[0].format('YYYY-MMM-DD HH:mm:ss'),
                date_to: values.request_date?.[1].format('YYYY-MMM-DD HH:mm:ss'),
              })
            }}
          >
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Space.Compact className="w-100">
                  <Tooltip title="Request Date">
                    <Form.Item name="is_using_date" valuePropName="checked">
                      <Checkbox />
                    </Form.Item>
                  </Tooltip>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.is_using_date !== currentValues.is_using_date
                    }
                  >
                    {({ getFieldValue }) => {
                      const isUsingDate = getFieldValue('is_using_date')
                      return (
                        <Form.Item name="request_date" noStyle>
                          <RangePicker
                            disabled={!isUsingDate}
                            className="ml-1 w-100"
                            allowClear={false}
                            format="YYYY-MM-DD HH:mm"
                            showTime={{ format: 'HH:mm' }}
                          />
                        </Form.Item>
                      )
                    }}
                  </Form.Item>
                </Space.Compact>
                <Form.Item name="request_id">
                  <Input placeholder="Request ID" />
                </Form.Item>
                <Form.Item name="bet_id">
                  <Input placeholder="Bet ID" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="user_login">
                  <Input placeholder="User Login" />
                </Form.Item>
                <Form.Item name="match_id" rules={[{ validator: validatorNumeric }]}>
                  <Input placeholder="Match ID" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="bet_status">
                  <Select options={betStatusOptions} />
                </Form.Item>
                <Form.Item name="payout_status">
                  <Select options={payoutStatusOptions} />
                </Form.Item>
                <Form.Item name="unprocess_status">
                  <Select options={unprocessStatusOptions} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="bet_confirm">
                  <Select options={betConfirmOptions} />
                </Form.Item>
                <Form.Item name="payout_confirm">
                  <Select options={payoutConfirmOptions} />
                </Form.Item>
                <Form.Item name="unprocess_confirm">
                  <Select options={unprocessConfirmOptions} />
                </Form.Item>
              </Col>
            </Row>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form>
        </div>
        <div className="card-body">
          <AutoSizer className="h-100 w-100">
            {({ height }) => {
              return (
                <Table
                  id="table-trading"
                  rowKey="request_id"
                  columns={columns}
                  loading={loading}
                  dataSource={dataTable}
                  pagination={false}
                  virtual
                  scroll={{ y: height - 67 }}
                />
              )
            }}
          </AutoSizer>
        </div>
      </div>
    </>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(BetRequestInfo)
