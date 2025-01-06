import React from 'react'
import { Button, Table, Input, Form, Row, Col, Select } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/sis/actions'
import { getGameTypeOptions } from 'helper'

const mapStateToProps = ({ sis }) => ({
  loadingTable: sis.loadingData,
  dataTable: sis.data_market_log,
})

const mapDispatchToProps = dispatch => ({
  LoadTable: payload => {
    dispatch({
      type: actions.LOAD_MARKET_LOG,
      payload,
      source: 'SIS Market Log',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP_MARKET_LOG }),
})

const statusOptions = [
  { label: 'All Status', value: '' },
  { label: 'Active', value: 'A' },
  { label: 'Suspended', value: 'S' },
  { label: 'Closed', value: 'C' },
]
const displayedOptions = [
  { label: 'All Displayed', value: '' },
  { label: 'Yes', value: 'Y' },
  { label: 'No', value: 'N' },
]

export const columns = [
  {
    title: 'Log Date',
    dataIndex: 'log_date',
    width: 150,
    render: record => record.formatDateTimeSecond(),
  },
  {
    title: 'Log Game Type',
    dataIndex: 'log_game_name',
    width: 150,
  },
  {
    title: 'Log Line',
    dataIndex: 'log_line',
    width: 50,
  },
  {
    title: 'Log Market',
    dataIndex: 'log_market',
  },
  {
    title: 'Log Status',
    dataIndex: 'log_status',
    width: 100,
  },
  {
    title: 'Log Is Displayed',
    dataIndex: 'log_is_displayed',
    width: 100,
    render: text => {
      if (text === 'N') return 'No'
      if (text === 'Y') return 'Yes'
      return ''
    },
  },
]

const SISMarketLog = ({ LoadTable, CleanUp, loadingTable, dataTable }) => {
  React.useEffect(() => CleanUp, [CleanUp])

  const gameTypeOptions = [{ value: -99, label: 'All Game Type' }].concat(getGameTypeOptions())
  return (
    <>
      <div className="card">
        <div className="card-header d-flex flex-row-reverse">
          <div className="w-100">
            <Form
              id="form"
              layout="vertical"
              initialValues={{
                game_type: -99,
                status: '',
                is_displayed: '',
              }}
              onFinish={values => {
                LoadTable(values)
              }}
            >
              <Row gutter={[8, 8]} className="mb-2">
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="match_id_sis" className="mb-0">
                    <Input className="w-100" placeholder="Match ID SIS" />
                  </Form.Item>
                  <Form.Item name="match_id" className="mb-0">
                    <Input className="w-100" placeholder="Match ID" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="game_type" className="mb-0">
                    <Select options={gameTypeOptions} className="w-100" />
                  </Form.Item>
                  <Form.Item name="status" className="mb-0">
                    <Select options={statusOptions} className="w-100" />
                  </Form.Item>
                  <Form.Item name="is_displayed" className="mb-0">
                    <Select options={displayedOptions} className="w-100" />
                  </Form.Item>
                </Col>
              </Row>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form>
          </div>
        </div>
        <div className="card-body">
          <Table
            rowKey={rowKey}
            size="small"
            loading={loadingTable}
            dataSource={dataTable}
            columns={columns}
            pagination={false}
          />
        </div>
      </div>
    </>
  )
}
const rowKey = record => `${record.log_date}-${record.log_game_type}-${record.log_line}`

export default connect(mapStateToProps, mapDispatchToProps)(SISMarketLog)
