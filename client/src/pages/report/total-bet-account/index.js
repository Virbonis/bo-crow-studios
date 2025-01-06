import React from 'react'
import { Row, Col, Table, Form, DatePicker, Button } from 'antd'
import { connect } from 'react-redux'
import { amount, Amount, useGetDateTimeBusinessHour } from 'components/blaise'
import actions from 'redux/total-bet-account/actions'
import MemberOnline from 'pages/trading/member-online'

const mapStateToProps = ({ totalBetAccount }) => ({
  loading: totalBetAccount.loadingData,
  tableData: totalBetAccount.data.result || [],
  totalPlayer: totalBetAccount.data.total || 0,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_TABLE,
      payload,
      source: 'Total Bet Account',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const { RangePicker } = DatePicker
const columns = [
  {
    title: 'Date',
    dataIndex: 'gl_date',
    width: 150,
    render: text => text.formatDate(),
  },
  {
    title: 'Total',
    dataIndex: 'total_player',
    width: 150,
    render: text => <Amount value={text} int />,
    align: 'right',
  },
]

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()

  if (!defaultDateTime) return null
  return <Component {...props} defaultDateTime={defaultDateTime} />
}

const SummaryTotalBetAccount = wrapperDate(
  ({ defaultDateTime, loading, tableData, totalPlayer, Load, CleanUp }) => {
    React.useEffect(() => CleanUp, [CleanUp])

    const [form] = Form.useForm()

    return (
      <div className="h-100">
        <MemberOnline />
        <div className="card">
          <div className="card-header">
            <Form
              form={form}
              className="w-100"
              initialValues={{
                date_range: [defaultDateTime, defaultDateTime],
              }}
              onFinish={values => {
                Load({
                  date_from: values.date_range[0].format('YYYY-MM-DD'),
                  date_to: values.date_range[1].format('YYYY-MM-DD'),
                })
              }}
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="date_range">
                    <RangePicker allowClear={false} format="YYYY-MM-DD" className="w-100" />
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
              rowKey="gl_date"
              className="w-50"
              loading={loading}
              columns={columns}
              dataSource={tableData}
              pagination={false}
              title={() => `Total Player : ${amount(totalPlayer, 0)}`}
              scroll={{ y: 500 }}
            />
          </div>
        </div>
      </div>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(SummaryTotalBetAccount)
