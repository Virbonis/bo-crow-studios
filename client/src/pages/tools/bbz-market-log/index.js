import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, Input, Select, Table, Row, Col } from 'antd'
import { getGameTypeOptions, validatorNumeric } from 'helper'
import actions from 'redux/bbz/actions'

const mapStateToProps = ({ bbz }) => ({
  dataTable: bbz.data_market_log,
  loading: bbz.loading,
})

const mapDispatchToProps = dispatch => ({
  LoadTable: payload => {
    dispatch({
      type: actions.LOAD_MARKET_LOG,
      payload,
      source: 'BBZ Market Log',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP_MARKET_LOG }),
})

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'A', label: 'Open' },
  { value: 'H', label: 'Close' },
]
const columns = [
  {
    title: 'Log Date',
    dataIndex: 'log_date',
    align: 'center',
    width: 120,
    render: data => data.formatDateTimeSecond(),
  },
  {
    title: 'Market ID',
    dataIndex: 'log_market_id',
    width: 120,
  },
  {
    title: 'Game Type',
    dataIndex: 'log_game_name',
    align: 'center',
    width: 120,
  },
  {
    title: 'Market',
    dataIndex: 'log_market',
    width: 200,
  },
  {
    title: 'Status',
    dataIndex: 'log_status',
    align: 'center',
    width: 120,
  },
  {
    title: 'Current Score',
    dataIndex: 'current_score',
    align: 'center',
    width: 120,
  },
]
const MarketBBZLog = ({ loading, dataTable, LoadTable, CleanUp }) => {
  React.useEffect(() => CleanUp, [CleanUp])

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="d-flex flex-row-reverse justify-content-between">
            <Form
              className="w-100"
              initialValues={{
                game_type: '',
                status: '',
              }}
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
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="game_type">
                    <Select
                      options={[{ label: 'All GameType', value: '' }].concat(getGameTypeOptions())}
                      showSearch
                    />
                  </Form.Item>
                  <Form.Item name="status">
                    <Select options={statusOptions} showSearch />
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
            rowKey={value => `${value.log_date}${value.log_market_id}`}
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

export default connect(mapStateToProps, mapDispatchToProps)(MarketBBZLog)
