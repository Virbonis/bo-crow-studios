import React from 'react'
import { connect } from 'react-redux'
import { Button, Col, Form, Input, Row, Table } from 'antd'
import actions from 'redux/mapping-bg-match/actions'
import { CustomizeCell } from 'components/blaise'
import { ReloadOutlined } from '@ant-design/icons'
import { validatorNumeric } from 'helper'

const mapStateToProps = ({ mappingBGMatch }) => ({
  loading: mappingBGMatch.loading,
  data: mappingBGMatch.data_game_event,
})

const mapDispatchToProps = dispatch => ({
  Load: payload =>
    dispatch({
      type: actions.LOAD_GAME_EVENT,
      payload,
      source: 'Mapping BG Game Event',
    }),
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const columns = [
  {
    title: 'Events',
    dataIndex: 'log_event',
    width: 400,
  },
  {
    title: 'Date',
    dataIndex: 'log_date',
    width: 400,
    render: text => text.formatDateTimeSecond(),
  },
  {
    title: 'Score',
    width: 400,
    render: record => `${record.home_score}-${record.away_score}`,
  },
]
const MappingBGMatch = ({ data, loading, Load, CleanUp }) => {
  React.useEffect(() => CleanUp, [CleanUp])
  const [form] = Form.useForm()

  return (
    <div className="card">
      <div className="card-header">
        <div className="d-flex flex-row-reverse justify-content-between">
          <Button icon={<ReloadOutlined />} onClick={() => form.submit()} />
          <Form
            form={form}
            className="w-100"
            onKeyPress={e => {
              if (e.key === 'Enter') {
                form.submit()
              }
            }}
            onFinish={values => {
              Load(values)
            }}
          >
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="match_id" rules={[{ validator: validatorNumeric }]}>
                  <Input placeholder="Match ID" />
                </Form.Item>
                <Form.Item
                  name="sports_ticker_id"
                  rules={[
                    {
                      validatorNumeric,
                    },
                  ]}
                >
                  <Input placeholder="Game ID BG" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
      <div className="card-body">
        <Table
          rowKey={value => `${value.log_date}${value.log_market_id}`}
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
          components={{
            body: {
              cell: CustomizeCell,
            },
          }}
          scroll={{ y: 500 }}
        />
      </div>
      <div className="card-footer">
        Note: <br />
        *If filter by Game ID BG, other filters will ignored
      </div>
    </div>
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(MappingBGMatch)
