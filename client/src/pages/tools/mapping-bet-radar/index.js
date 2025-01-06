import React from 'react'
import { Col, Form, Row, Input, Table, Button } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/mapping-bet-radar/actions'
import { validatorNumeric } from 'helper'

const mapStateToProps = ({ mappingBetRadar }) => ({
  tableData: mappingBetRadar.data,
  loading: mappingBetRadar.loadingData,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_TABLE,
      payload,
      source: 'Mapping Bet Radar',
    })
  },
})

const columns = [
  {
    title: 'Update Type',
    dataIndex: 'update_type',
    width: 200,
  },
  {
    title: 'Stamp Date',
    dataIndex: 'stamp_date',
    width: 200,
    render: text => text.formatDateTimeSecond(),
  },
  {
    title: 'Sport Radar ID',
    dataIndex: 'sport_radar_id',
    width: 200,
  },
]
const MappingBetRadar = ({ loading, tableData, Load }) => {
  const [form] = Form.useForm()

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="d-flex flex-row-reverse" style={{ gap: 8 }}>
            <Form
              form={form}
              className="w-100"
              labelCol={{ span: 2 }}
              wrapperCol={{ span: 4 }}
              onFinish={values => {
                Load({
                  match_id: values.match_id ? values.match_id : 0,
                })
              }}
            >
              <Form.Item name="match_id" label="Match ID" rules={[{ validator: validatorNumeric }]}>
                <Input />
              </Form.Item>
              <Row>
                <Col offset={2} span={8}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <div className="card-body">
          <Table
            rowKey={x => `${x.update_type}-${x.stamp_date}-${x.sport_radar_id}`}
            className="w-50"
            size="small"
            bordered
            loading={loading}
            columns={columns}
            dataSource={tableData}
            pagination={false}
          />
        </div>
      </div>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(MappingBetRadar)
