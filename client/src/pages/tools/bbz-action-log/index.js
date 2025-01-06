import React from 'react'
import { Button, Col, Form, Input, Row, Table } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/bbz/actions'
import { validatorNumeric } from 'helper'

const mapStateToProps = ({ bbz }) => ({
  loading: bbz.loading,
  dataTable: bbz.data_action_log,
})

const mapDispatchToProps = dispatch => ({
  LoadTable: payload => {
    dispatch({
      type: actions.LOAD_ACTION_LOG,
      payload,
      source: 'BBZ Action Log',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const columns = [
  {
    title: 'Log Description',
    dataIndex: 'log_desc',
    width: 200,
  },
  {
    title: 'Log Date',
    dataIndex: 'log_date',
    width: 200,
    render: text => text.formatDateTimeSecond(),
  },
]
const BBZActionLog = ({ loading, dataTable, LoadTable, CleanUp }) => {
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
                    name="match_id_bbz"
                    extra="*If filter by Match ID BBZ, other filters will ignored"
                  >
                    <Input placeholder="Match ID BBZ" />
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
            loading={loading}
            columns={columns}
            dataSource={dataTable}
            pagination={false}
          />
        </div>
      </div>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(BBZActionLog)
