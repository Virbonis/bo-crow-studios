import React from 'react'
import { connect } from 'react-redux'
import { Button, Col, Form, Input, Row, Table } from 'antd'
import actions from 'redux/bbz/actions'
import { Amount } from 'components/blaise'
import { validatorNumeric } from 'helper'

const mapStateToProps = ({ bbz }) => ({
  loading: bbz.loading,
  dataTable: bbz.data_market,
})

const mapDispatchToProps = dispatch => ({
  LoadTable: payload => {
    dispatch({
      type: actions.LOAD_MARKET,
      payload,
      source: 'BBZ Market',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP_MARKET }),
})

const columns = [
  {
    title: 'Market ID',
    dataIndex: 'market_id',
    width: 120,
  },
  {
    title: 'Game Type',
    dataIndex: 'game_type',
    align: 'center',
    width: 120,
  },
  {
    title: 'Handicap',
    dataIndex: 'handicap',
    align: 'right',
    width: 120,
    render: text => <Amount value={text} />,
  },
  {
    title: 'Odds1',
    dataIndex: 'odds1',
    align: 'right',
    width: 120,
    render: text => <Amount value={text} />,
  },
  {
    title: 'Odds2',
    dataIndex: 'odds2',
    align: 'right',
    width: 120,
    render: text => <Amount value={text} />,
  },
  {
    title: 'Odds3',
    dataIndex: 'odds3',
    align: 'right',
    width: 120,
    render: text => <Amount value={text} />,
  },
  {
    title: 'Last Update',
    dataIndex: 'stamp_date',
    align: 'center',
    width: 120,
    render: data => data.formatDateTimeSecond(),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    align: 'center',
    width: 120,
  },
]
const BBZMarket = ({ loading, dataTable, LoadTable, CleanUp }) => {
  React.useEffect(() => CleanUp, [CleanUp])

  return (
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
          rowKey="market_id"
          loading={loading}
          columns={columns}
          dataSource={dataTable}
          pagination={false}
        />
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(BBZMarket)
