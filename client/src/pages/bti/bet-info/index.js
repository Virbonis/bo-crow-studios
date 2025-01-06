import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
} from 'antd'
import { Amount, useGetDateTimeDBServer } from 'components/blaise'
import React from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { connect } from 'react-redux'
import actions from 'redux/bti-bet-info/actions'

const mapSateToProps = ({ BTIBetInfo }) => ({
  dataTable: BTIBetInfo.data,
  loading: BTIBetInfo.loading,
})

const mapDispatchToProps = dispatch => ({
  LoadTable: payload => {
    dispatch({
      type: actions.LOAD_TABLE,
      payload,
      source: 'BTI Bet Info',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeDBServer()
  if (!defaultDateTime) return null
  return <Component {...props} defaultDateTime={defaultDateTime} />
}

const { RangePicker } = DatePicker
const reserveStatusOptions = [
  { value: -99, label: 'All Reserve Status' },
  { value: 0, label: 'UnReserved' },
  { value: 1, label: 'Reserved' },
  { value: 2, label: 'Debit' },
  { value: 3, label: 'Commit' },
  { value: -1, label: 'Cancel' },
]
const transactionStatusOptions = [
  { value: -99, label: 'All Transaction Status' },
  { value: 0, label: 'Pending' },
  { value: 1, label: 'Finish' },
]

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
    align: 'center',
    dataIndex: 'user_login',
    width: 100,
  },
  {
    title: 'Bet ID',
    align: 'center',
    dataIndex: 'bet_id',
    width: 75,
  },
  {
    title: 'Bet Amount',
    dataIndex: 'bet_amount',
    render: text => <Amount value={text} />,
    width: 60,
    align: 'right',
  },
  {
    title: 'Reserve ID',
    align: 'center',
    dataIndex: 'reserve_id',
    width: 110,
  },
  {
    title: 'Reserve Date',
    align: 'center',
    dataIndex: 'reserve_date',
    render: text => text && text.formatDateTimeSecond(),
    width: 100,
  },
  {
    title: 'Reserve Status',
    align: 'center',
    dataIndex: 'reserve_status',
    width: 75,
  },
  {
    title: 'Debit Date',
    align: 'center',
    dataIndex: 'debit_date',
    render: text => text && text.formatDateTimeSecond(),
    width: 100,
  },
  {
    title: 'Commit Date',
    align: 'center',
    dataIndex: 'commit_date',
    render: text => text && text.formatDateTimeSecond(),
    width: 100,
  },
  {
    title: 'Cancel Date',
    align: 'center',
    dataIndex: 'cancel_date',
    render: text => text && text.formatDateTimeSecond(),
    width: 100,
  },
  {
    title: 'Transaction Status',
    align: 'center',
    dataIndex: 'transaction_status',
    width: 75,
  },
  {
    title: 'Waiting ID',
    align: 'center',
    dataIndex: 'waiting_id',
    width: 125,
  },
  {
    title: 'Purchase ID',
    align: 'center',
    dataIndex: 'purchase_id',
    width: 110,
  },
  {
    title: 'Payout Date',
    align: 'center',
    dataIndex: 'payout_date',
    render: text => text && text.formatDateTimeSecondMillisecond(),
    width: 100,
  },
]
const BTIBetInfo = wrapperDate(({ defaultDateTime, dataTable, loading, LoadTable, CleanUp }) => {
  React.useEffect(() => CleanUp, [CleanUp])
  const [form] = Form.useForm()

  return (
    <div className="card">
      <div className="card-header">
        <Form
          form={form}
          initialValues={{
            request_date: [defaultDateTime.clone().startOf('day'), defaultDateTime],
            reservation_status: -99,
            trans_status: -99,
          }}
          onFinish={values => {
            LoadTable({
              ...values,
              is_using_date: values.is_using_date ? 1 : 0,
              req_date_from: values.request_date?.[0].format('YYYY-MM-DD HH:mm'),
              req_date_to: values.request_date?.[1].format('YYYY-MM-DD HH:mm'),
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
              <Form.Item name="match_id">
                <Input placeholder="Match ID" />
              </Form.Item>
              <Form.Item name="purchase_id">
                <Input placeholder="Purchase ID" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
              <Form.Item name="reservation_status">
                <Select options={reserveStatusOptions} />
              </Form.Item>
              <Form.Item name="trans_status">
                <Select options={transactionStatusOptions} />
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
                scroll={{ y: height - 37 }}
              />
            )
          }}
        </AutoSizer>
      </div>
    </div>
  )
})

export default connect(mapSateToProps, mapDispatchToProps)(BTIBetInfo)
