import React from 'react'
import { Row, Col, Form, Button, Table, Input, Select } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/odds-log-1x2/actions'
import { Amount } from 'components/blaise'
import { getGameTypeDescriptionShort, validatorNumeric } from 'helper'

const mapStateToProps = ({ oddsLog1x2 }) => ({
  tableData: oddsLog1x2.data.map((data, index) => ({ ...data, key: index + 1 })),
  loading: oddsLog1x2.loading,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Odds Log 1X2',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const gameTypeOptions = [
  { value: -99, label: 'Show All Game Type' },
  { value: 1, label: 'FT.1x2' },
  { value: 8, label: 'HT.1x2' },
]
const marketOptions = [
  { value: '', label: 'Show All Market' },
  { value: 'Y', label: 'Live' },
  { value: 'N', label: 'Deadball' },
]
const columns = [
  {
    title: 'Match ID',
    dataIndex: 'match_id',
    align: 'center',
    width: 100,
  },
  {
    title: 'Market',
    align: 'center',
    dataIndex: 'market',
    width: 120,
  },
  {
    title: 'Game Type',
    dataIndex: 'game_type',
    align: 'center',
    width: 100,
    render: text => getGameTypeDescriptionShort(text),
  },
  {
    title: 'Date',
    align: 'center',
    dataIndex: 'stamp_date',
    width: 100,
    render: text => text.formatDateTimeSecond(),
  },
  {
    title: 'Odds',
    align: 'center',
    children: [
      {
        title: 'Home',
        align: 'right',
        dataIndex: 'odds_home',
        width: 80,
        render: text => <Amount value={text} />,
      },
      {
        title: 'Draw',
        align: 'right',
        dataIndex: 'odds_draw',
        width: 80,
        render: text => <Amount value={text} />,
      },
      {
        title: 'Away',
        align: 'right',
        dataIndex: 'odds_away',
        width: 80,
        render: text => <Amount value={text} />,
      },
    ],
  },
  {
    title: 'Stamp User',
    dataIndex: 'stamp_user',
    align: 'center',
    width: 100,
  },
  {
    title: 'Auto Calculate',
    dataIndex: 'auto_calc',
    align: 'center',
    width: 100,
  },
]
const OddsLog1x2 = ({ loading, tableData, Load, CleanUp }) => {
  React.useEffect(() => CleanUp, [CleanUp])

  const [form] = Form.useForm()

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="d-flex flex-row-reverse">
            <Form
              form={form}
              className="w-100"
              initialValues={{
                match_id: '',
                market: '',
                game_type: -99,
              }}
              onFinish={values => Load(values)}
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="match_id" rules={[{ validator: validatorNumeric }]}>
                    <Input placeholder="Match ID" required />
                  </Form.Item>
                  <Form.Item name="market">
                    <Select options={marketOptions} showSearch />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="game_type">
                    <Select showSearch optionFilterProp="label" options={gameTypeOptions} />
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
            bordered
            loading={loading}
            dataSource={tableData}
            columns={columns}
            pagination={false}
          />
        </div>
      </div>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(OddsLog1x2)
