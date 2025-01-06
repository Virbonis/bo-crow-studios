import React from 'react'
import { Col, Form, Row, Input, Table, Button } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/im/actions'
import { validatorNumeric } from 'helper'

const mapStateToProps = ({ im }) => ({
  loadingTable: im.loading,
  dataTable: im.data_action_log,
})

const mapDispatchToProps = dispatch => ({
  LoadTable: payload => {
    dispatch({
      type: actions.LOAD_ACTION_LOG,
      payload,
      source: 'IM Action Log',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP_ACTION_LOG }),
})

const columns = [
  {
    title: 'Log Description',
    dataIndex: 'log_desc',
    width: 300,
  },
  {
    title: 'Log Date',
    dataIndex: 'log_date',
    width: 300,
    render: text => text.formatDateTimeSecond(),
  },
]
const IMActionLog = ({ loadingTable, dataTable, LoadTable, CleanUp }) => {
  React.useEffect(() => CleanUp, [CleanUp])

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="d-flex flex-row-reverse justify-content-between">
            <Form
              className="w-100"
              onFinish={values => {
                LoadTable(values)
              }}
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item
                    name="match_id_im"
                    extra="*If filter by Match ID IM, other filters will ignored"
                  >
                    <Input placeholder="Match ID IM" />
                  </Form.Item>
                  <Form.Item name="match_id" rules={[{ validator: validatorNumeric }]}>
                    <Input placeholder="Match ID" />
                  </Form.Item>
                </Col>
              </Row>
              <Button htmlType="submit" type="primary">
                Submit
              </Button>
            </Form>
          </div>
        </div>
        <div className="card-body">
          <Table
            rowKey="log_date"
            loading={loadingTable}
            columns={columns}
            dataSource={dataTable}
            pagination={false}
          />
        </div>
      </div>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(IMActionLog)
