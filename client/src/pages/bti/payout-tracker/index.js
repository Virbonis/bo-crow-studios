import { Button, Col, Form, Input, Row, Table } from 'antd'
import { Amount } from 'components/blaise'
import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/bti-payout-tracker/actions'

const mapStateToProps = ({ BTIpayoutTracker }) => ({
  dataTable: BTIpayoutTracker.data,
  loading: BTIpayoutTracker.loading,
})

const mapDispatchToProps = dispatch => ({
  LoadTable: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'BTI Payout Tracker',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const columns = [
  {
    title: 'Purchase ID',
    dataIndex: 'purchase_id',
    align: 'center',
    width: 150,
  },
  {
    title: 'User Login',
    dataIndex: 'user_login',
    align: 'center',
    width: 120,
  },
  {
    title: 'Payout Amout',
    dataIndex: 'payout_amount',
    align: 'right',
    width: 120,
    render: text => <Amount value={text} />,
  },
  {
    title: 'Payout Status',
    dataIndex: 'payout_status',
    align: 'center',
    width: 120,
  },
  {
    title: 'BTI Payout Seq',
    dataIndex: 'payout_seq',
    align: 'center',
    width: 50,
  },
  {
    title: <span title="Time when BTI processing payout">BTI Payout Date</span>,
    dataIndex: 'payout_time',
    align: 'center',
    width: 100,
    render: text => text && text.formatDateTimeSecondMillisecond(),
  },
  {
    title: <span title="Time when system received payout">Received Date</span>,
    dataIndex: 'payout_date',
    align: 'center',
    width: 100,
    render: text => text && text.formatDateTimeSecondMillisecond(),
  },
  {
    title: <span title="Time when system process internal payout">Process Date</span>,
    dataIndex: 'process_date',
    align: 'center',
    width: 100,
    render: text => text && text.formatDateTimeSecondMillisecond(),
  },
  {
    title: 'Process ID',
    dataIndex: 'process_id',
    width: 200,
  },
]
const BTIPayoutTracker = ({ dataTable, loading, LoadTable, CleanUp }) => {
  React.useEffect(() => CleanUp, [CleanUp])
  const [form] = Form.useForm()

  return (
    <>
      <div className="card">
        <div className="card-header">
          <Form
            form={form}
            onFinish={values => {
              LoadTable(values)
            }}
          >
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="bet_id">
                  <Input placeholder="Bet ID" />
                </Form.Item>
                <Form.Item name="purchase_id">
                  <Input placeholder="Purchase ID" />
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
            rowKey={data => `${data.purchase_id}${data.payout_date}`}
            loading={loading}
            columns={columns}
            dataSource={dataTable}
            pagination={false}
            scroll={{ x: 'max-content', y: true }}
          />
        </div>
        <div className="card-footer">
          <b>
            Notes:
            <br />- BTI Payout Date: Time when BTI processing payout
            <br />- Received Date: Time when system received payout
            <br />- Process Date: Time when system process internal payout
          </b>
        </div>
      </div>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(BTIPayoutTracker)
