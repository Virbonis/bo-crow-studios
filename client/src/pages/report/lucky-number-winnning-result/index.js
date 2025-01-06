import React from 'react'
import { Row, Col, Table, Form, DatePicker, Input, Button } from 'antd'
import { connect } from 'react-redux'
import { Amount, useGetDateTimeDBServer } from 'components/blaise'
import actions from 'redux/lucky-number/actions'

const mapStateToProps = ({ luckyNumber }) => ({
  tableData: luckyNumber.data,
  loading: luckyNumber.loadingData,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_TABLE,
      payload,
      source: 'Lucky Number',
    })
  },
})

const { RangePicker } = DatePicker

const wrapperDate = Component => props => {
  const defaultDateTimeServer = useGetDateTimeDBServer()

  if (!defaultDateTimeServer) return null
  return <Component {...props} defaultDateTimeServer={defaultDateTimeServer} />
}

const LuckyNumber = wrapperDate(({ defaultDateTimeServer, tableData, loading, Load }) => {
  const [form] = Form.useForm()

  React.useEffect(() => {
    form.setFieldsValue({
      date_range: [
        defaultDateTimeServer.clone().set({ hour: 0, minute: 0 }),
        defaultDateTimeServer.clone().set({ hour: 0, minute: 0 }),
      ],
    })
  }, [form, defaultDateTimeServer])

  const columns = [
    {
      title: 'Bet ID',
      dataIndex: 'no_txn',
      align: 'center',
      width: 120,
    },
    {
      title: 'Bet Date',
      dataIndex: 'trans_date',
      align: 'center',
      width: 120,
      render: text => text && text.formatDateTimeSecond(),
    },
    {
      title: 'User Name',
      dataIndex: 'user_id',
      align: 'center',
      width: 120,
    },
    {
      title: 'Curr',
      dataIndex: 'currency',
      align: 'center',
      width: 120,
    },
    {
      title: 'Bet Amount(F)',
      dataIndex: 'bet_amount',
      align: 'center',
      width: 120,
      render: text => <Amount value={text} />,
    },
  ]

  return (
    <>
      <div className="card">
        <div className="card-header">
          <Form
            form={form}
            className="w-100"
            onFinish={values => {
              Load({
                ...values,
                date_from: values.date_range[0].format('YYYY-MM-DD HH:mm'),
                date_to: values.date_range[1].format('YYYY-MM-DD HH:mm'),
              })
            }}
          >
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="date_range" className="mb-0">
                  <RangePicker
                    className="w-100"
                    allowClear={false}
                    showTime={{ format: 'HH:mm' }}
                  />
                </Form.Item>
              </Col>{' '}
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item
                  name="bet_id"
                  rules={[{ required: true, message: 'Please input Bet ID' }]}
                >
                  <Input placeholder="Bet ID" className="w-100" />
                </Form.Item>
              </Col>
            </Row>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form>
        </div>
        <div className="card-body">
          <Table
            rowKey="no_txn"
            bordered
            size="small"
            loading={loading}
            columns={columns}
            dataSource={tableData}
            pagination={false}
          />
        </div>
      </div>
    </>
  )
})
export default connect(mapStateToProps, mapDispatchToProps)(LuckyNumber)
