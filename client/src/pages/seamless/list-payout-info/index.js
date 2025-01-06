import React, { useState } from 'react'
import { Button, Col, Table, Form, Input, Row, Typography } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/list-payout-info/actions'
import { Amount } from 'components/blaise'

const { Text } = Typography
const mapStateToProps = ({ listPayoutInfo }) => ({
  tableData: listPayoutInfo.data,
  loadingData: listPayoutInfo.loadingData,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_PAYOUT_INFO,
      payload,
      source: 'List Payout Info',
    })
  },
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_LIST_PAYOUT_INFO,
      payload,
      successCallback,
      source: 'List Payout Info',
    })
  },
})

const columns = [
  {
    title: 'Log ID',
    dataIndex: 'log_id',
    align: 'center',
    width: 100,
  },
  {
    title: 'Bet ID',
    dataIndex: 'no_txn',
    align: 'center',
    width: 100,
  },
  {
    title: 'Payout Date',
    dataIndex: 'payout_date',
    align: 'center',
    width: 150,
    render: text => text.formatDateTimeSecond(),
  },
  {
    title: 'Confirm Date',
    dataIndex: 'confirm_date',
    align: 'center',
    width: 150,
    render: text => text && text.formatDateTimeSecond(),
  },
  {
    title: 'Payout Type',
    dataIndex: 'payout_type',
    align: 'center',
    width: 120,
  },
  {
    title: 'Payout Amount',
    dataIndex: 'payout_amount',
    align: 'center',
    width: 120,
    render: amount => <Amount value={amount} length={4} />,
  },
  {
    title: 'Ticket Status',
    dataIndex: 'ticket_status',
    align: 'center',
    width: 120,
  },
  {
    title: 'Process ID',
    dataIndex: 'process_id',
    align: 'center',
    width: 300,
  },
  {
    title: 'Retries',
    dataIndex: 'retries',
    align: 'center',
    width: 80,
  },
  {
    title: 'Last Error',
    dataIndex: 'last_error',
    align: 'center',
    width: 120,
    render: text => <Text className="text-wrap">{text}</Text>,
  },
]

const ListPayoutInfo = ({ tableData, loadingData, Load, Update }) => {
  const [form] = Form.useForm()
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const reload = React.useCallback(() => {
    form.submit()
  }, [form])

  const onSubmit = () => {
    Update({ log_ids: selectedRowKeys.join(',') }, reload)
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <Form
            form={form}
            onFinish={values => {
              Load(values)
            }}
          >
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item
                  name="bet_ids"
                  extra={`*support multiple ID's eg: 3,4,5`}
                  rules={[
                    {
                      validator(_, value) {
                        if (
                          /[A-Z`!#$%^&*()@+\-=\[\]{};':"\\|.<>\/?~]/i.test(value) &&
                          value?.length > 0
                        ) {
                          return Promise.reject(new Error('Numeric and ,'))
                        }
                        return Promise.resolve()
                      },
                    },
                  ]}
                >
                  <Input placeholder="Bet IDs" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="process_id">
                  <Input placeholder="Process ID" />
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
            rowKey="log_id"
            size="small"
            loading={loadingData}
            bordered
            dataSource={tableData}
            columns={columns}
            pagination={false}
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            title={() => (
              <Button type="primary" disabled={!selectedRowKeys.length > 0} onClick={onSubmit}>
                Update
              </Button>
            )}
          />
        </div>
      </div>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ListPayoutInfo)
