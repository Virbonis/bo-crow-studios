import { Button, Col, Form, Row, Select, Space, Switch } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import React from 'react'
import { connect } from 'react-redux'
import actionsMatch from 'redux/match/actions'
import QueryRunningBallPopUp from './query'
import DivOptions from './component/div-options'
import TableRunningBallQuick from './component/table-running-ball-quick'
import TablePending from './component/table-pending'
import TablePendingSummary from './component/table-pending-summary'
import 'pages/trading/shared-components/trading.scss'

const mapStateToProps = ({ match }) => ({
  matchOptions: match.select
    .filter(e => e.rb_game !== null)
    .map(v => ({
      value: v.match_id,
      label: `${v.home_name} - ${v.away_name}`,
      no_display_match: v.no_display_match,
    }))
    .sort((a, b) => a.no_display_match - b.no_display_match),
  defaultMatchID: match.select
    .filter(e => e.rb_game !== null)
    .sort((a, b) => a.no_display_match - b.no_display_match)[0]?.match_id,
})

const mapDispatchToProps = dispatch => ({
  LoadSelect: payload => {
    dispatch({
      type: actionsMatch.LOAD_SELECT,
      payload,
      source: 'Match',
    })
  },
})

const intervalOptions = [
  { label: 'None', value: 0 },
  { label: '3s', value: 3 },
  { label: '5s', value: 5 },
  { label: '10s', value: 10 },
]

const scroll = {
  x: 'max-content',
}

const rowClassName = x => {
  if (x.league_group) return 'separator-league-color'

  if (x.match_pause_status === 1) return 'tr-match-paused'
  if (x.match_open_status === 'N') return 'tr-match-off'
  return x.rowNumber % 2 !== 0 ? 'tr-odd' : 'tr-even'
}

const TradingRunningBallQuick = ({
  match_id, // if any match_id = from original runningball
  defaultMatchID,
  matchOptions,
  LoadSelect,
}) => {
  const [form] = Form.useForm()

  React.useEffect(() => {
    LoadSelect({ group: 'RunningBall' })
  }, [LoadSelect])

  React.useEffect(() => {
    setViewParameter(prev => ({
      ...prev,
      match_id: match_id || defaultMatchID,
    }))
    form.setFieldsValue({ match_id: match_id || defaultMatchID })
  }, [form, match_id, defaultMatchID])

  const [viewParameter, setViewParameter] = React.useState({
    is_show_in_active: false,
    interval: 3,
    match_id: match_id || defaultMatchID,
  })

  const { data = {}, isFetching, refetch } = QueryRunningBallPopUp({
    is_show_in_active: viewParameter.is_show_in_active ? 'Y' : 'N',
    match_id: viewParameter.match_id,
    interval: viewParameter.interval,
  })

  const wrappedRefetch = React.useCallback(() => {
    LoadSelect({ group: 'RunningBall' })
    refetch()
  }, [LoadSelect, refetch])

  const onValuesChange = (changedValues, values) => {
    setViewParameter(prev => ({ ...prev, ...values }))
  }

  return (
    <>
      <Space align="start">
        {!match_id && (
          <DivOptions
            refetch={wrappedRefetch}
            viewParameter={viewParameter}
            onValuesChange={onValuesChange}
            matchOptions={matchOptions}
          />
        )}
        <Button size="small" loading={isFetching} icon={<ReloadOutlined />} onClick={refetch}>
          Refresh
        </Button>
        <Form form={form} initialValues={viewParameter} onValuesChange={onValuesChange}>
          <Space align="start">
            <Form.Item name="interval">
              <Select style={{ width: 75 }} options={intervalOptions} />
            </Form.Item>
            <Form.Item name="is_show_in_active" label="Inactive" valuePropName="checked">
              <Switch checkedChildren="Show" unCheckedChildren="Hide" />
            </Form.Item>
          </Space>
        </Form>
      </Space>
      <TableRunningBallQuick
        refetch={refetch}
        dataSource={data.tableData}
        data={data}
        id="table-trading"
        bordered
        size="small"
        pagination={false}
        scroll={scroll}
        rowClassName={rowClassName}
      />
      <Row justify="space-between" gutter={4}>
        <Col span={7}>
          <TablePending data={data.pendingData} type="pending" />
        </Col>
        <Col span={7}>
          <TablePending data={data.acceptData} type="accept" />
        </Col>
        <Col span={7}>
          <TablePending data={data.rejectData} type="reject" />
        </Col>
        <Col span={3}>
          <TablePendingSummary detailData={data.dataSource?.[0]} data={data.pendingSummaryData} />
        </Col>
      </Row>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(TradingRunningBallQuick)
