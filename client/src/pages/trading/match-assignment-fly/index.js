import React from 'react'
import { Button, Tooltip, Form, Select, Descriptions, Row, Col, Space, Spin } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import actions from 'redux/match-assignment/actions'
import TableLeague from '../shared-components/match-assignment/table-league'
import '../shared-components/match-assignment/custom-virtualize.scss'
import TableMatchVirtualize from './table-match-virtualize'

const mapStateToProps = ({ matchAssignment }) => ({
  traders: matchAssignment.traders?.map(v => ({
    label: v.trader_desc,
    value: v.trader_name,
  })),
  defaultTraderName: matchAssignment.traders[0]?.trader_name || '',
  loadingCounter: matchAssignment.loadingCounter,
  dataCounter: matchAssignment.dataCounter,
  loadingLeague: matchAssignment.loadingLeague,
  loadingMatch: matchAssignment.loadingMatch,
})

const mapDispatchToProps = dispatch => ({
  LoadTrader: () => {
    dispatch({
      type: actions.LOAD_TRADER,
      source: 'Match Assignment',
    })
  },
  LoadCounter: payload => {
    dispatch({
      type: actions.LOAD_COUNTER,
      payload,
      source: 'Match Assignment',
    })
  },
  LoadLeague: payload => {
    dispatch({
      type: actions.LOAD_LEAGUE,
      payload,
      source: 'Match Assignment',
    })
  },
  LoadMatch: payload => {
    dispatch({
      type: actions.LOAD_MATCH,
      payload,
      source: 'Match Assignment',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const MatchAssignment = ({
  traders,
  defaultTraderName,
  LoadTrader,

  loadingCounter,
  dataCounter,
  LoadCounter,

  LoadLeague,
  LoadMatch,
  CleanUp,

  loadingMatch,
  loadingLeague,
}) => {
  React.useEffect(() => CleanUp, [CleanUp])

  const [form] = Form.useForm()
  const reload = React.useCallback(() => form.submit(), [form])
  const traderNameRef = React.useRef()

  React.useEffect(() => {
    LoadTrader()
    LoadCounter()
  }, [LoadTrader, LoadCounter])

  React.useLayoutEffect(() => {
    if (!defaultTraderName) return
    form.setFieldsValue({
      trader_name: defaultTraderName,
    })
    reload()
  }, [form, defaultTraderName, reload])

  return (
    <div className="card">
      <div className="card-header">
        <Row justify="space-between">
          <Col>
            <Form
              form={form}
              id="parent-form"
              layout="inline"
              className="mb-2 w-100"
              onFinish={values => {
                if (!values.trader_name) return
                traderNameRef.current = values.trader_name
                LoadCounter(values)
                LoadLeague(values)
                LoadMatch(values)
              }}
              onValuesChange={values => {
                if (!values.trader_name) return
                traderNameRef.current = values.trader_name
                LoadCounter(values)
                LoadLeague(values)
                LoadMatch(values)
              }}
            >
              <div className="d-flex flex-row">
                <Form.Item name="trader_name" label="Trader">
                  <Select
                    showSearch
                    allowClear
                    placeholder="Select Trader"
                    options={traders}
                    optionFilterProp="label"
                    style={{ width: 200 }}
                  />
                </Form.Item>
                <span>
                  <b>*see username and amount in ACRJ</b>
                </span>
              </div>
            </Form>
          </Col>
          <Col>
            <Space>
              <Spin spinning={loadingCounter}>
                <Descriptions size="small" layout="vertical" column={8} bordered>
                  {dataCounter.map(({ match_time_slot, counter }) => (
                    <Descriptions.Item
                      key={match_time_slot}
                      label={match_time_slot?.toUpperCase()}
                      contentStyle={{ textAlign: 'center', fontWeight: 'bold' }}
                    >
                      {counter}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </Spin>
              <Tooltip placement="top" title="Refresh list">
                <Button icon={<ReloadOutlined />} onClick={reload} />
              </Tooltip>
            </Space>
          </Col>
        </Row>
      </div>
      <div className="card-body">
        <Row justify="space-between" gutter={[8, 8]}>
          <Col span={6}>
            <Spin spinning={loadingLeague}>
              <TableLeague reload={reload} traderName={traderNameRef.current} />
            </Spin>
          </Col>
          <Col span={18}>
            <Spin spinning={loadingMatch}>
              <TableMatchVirtualize reload={reload} traderName={traderNameRef.current} />
            </Spin>
          </Col>
        </Row>
      </div>
      <div className="card-footer">
        <div>
          <b>LEGEND</b>
        </div>
        <span className="icon_counter_unassigned_games">11</span> Counter Unassigned Games
        <br />
        <span className="icon_live" /> Live Games
        <br />
        <span className="icon_delayed_live" /> Delayed Live Games
        <br />
        <span className="icon_has_live" /> Has Live Games
        <br />
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchAssignment)
