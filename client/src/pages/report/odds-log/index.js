import React from 'react'
import { Row, Col, Form, Button, Table, Input, Select } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/odds-log/actions'
import { Amount } from 'components/blaise'
import { gameTypeOddsLog, validatorNumeric, getGameTypeDescriptionShort } from 'helper'

const mapStateToProps = ({ oddsLog }) => ({
  tableData: oddsLog.data,
  loading: oddsLog.loading,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Odds Log',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const marketOptions = [
  { value: '', label: 'Show All Market' },
  { value: 'Live', label: 'Live' },
  { value: 'Today', label: 'Today' },
  { value: 'Early', label: 'Early' },
]
const gameTypeOptions = [{ value: -99, label: 'Show All Game type' }].concat(gameTypeOddsLog)

export const columns = [
  {
    title: 'Match ID',
    dataIndex: 'match_id',
    align: 'center',
    width: 100,
  },
  {
    title: 'Score',
    align: 'center',
    width: 80,
    render: ({ market, home_posisi, away_posisi }) =>
      market.toLowerCase() === 'live' && `${home_posisi} - ${away_posisi}`,
  },
  {
    title: 'Line',
    dataIndex: 'line',
    align: 'center',
    width: 40,
  },
  {
    title: 'Market',
    dataIndex: 'market',
    align: 'center',
    width: 100,
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
    dataIndex: 'stamp_date',
    align: 'center',
    width: 125,
    render: text => text.formatDateTimeSecond(),
  },
  {
    title: 'HDC',
    dataIndex: 'handicap',
    render: text => <Amount value={text} />,
    align: 'center',
    width: 50,
  },
  {
    title: 'Odds',
    align: 'center',
    children: [
      {
        title: 'Before',
        align: 'center',
        onHeaderCell: () => ({ rowSpan: 2 }),
        children: [
          {
            title: 'test',
            dataIndex: 'odds_home_before',
            render: text => <Amount value={text} />,
            align: 'right',
            onHeaderCell: () => ({ className: 'd-none' }),
            width: 50,
          },
          {
            dataIndex: 'odds_away_before',
            render: text => <Amount value={text} />,
            align: 'right',
            onHeaderCell: () => ({ className: 'd-none' }),
            width: 50,
          },
        ],
      },
      {
        title: 'Point',
        align: 'center',
        dataIndex: 'move_point_trader',
        render: text => <Amount value={text} />,
        onCell: () => ({ className: 'bg-pink' }),
        width: 50,
      },
      {
        title: 'After',
        align: 'center',
        onHeaderCell: () => ({ rowSpan: 2 }),
        children: [
          {
            dataIndex: 'odds_home_after',
            render: text => <Amount value={text} />,
            align: 'right',
            onHeaderCell: () => ({ className: 'd-none' }),
            width: 50,
          },
          {
            dataIndex: 'odds_away_after',
            render: text => <Amount value={text} />,
            align: 'right',
            onHeaderCell: () => ({ className: 'd-none' }),
            width: 50,
          },
        ],
      },
    ],
  },
  {
    title: 'Stamp User',
    dataIndex: 'stamp_user',
    align: 'center',
    width: 80,
  },
  {
    title: 'Action',
    dataIndex: 'source_page',
    align: 'center',
    width: 150,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    align: 'center',
    width: 125,
  },
]
const OddsLog = ({ loading, tableData, Load, CleanUp }) => {
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
                line: '',
                game_type: -99,
              }}
              onFinish={values => Load(values)}
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item
                    name="match_id"
                    rules={[
                      { required: true, message: 'Please Input Match ID' },
                      { validator: validatorNumeric },
                    ]}
                  >
                    <Input placeholder="Match ID" />
                  </Form.Item>
                  <Form.Item name="market">
                    <Select showSearch optionFilterProp="label" options={marketOptions} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item
                    name="line"
                    rules={[{ required: true, message: 'Please Input Line' }, { validatorNumeric }]}
                  >
                    <Input placeholder="Line" maxLength={5} />
                  </Form.Item>
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
            rowKey="row_id"
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

export default connect(mapStateToProps, mapDispatchToProps)(OddsLog)
