import React from 'react'
import { Button, Col, Form, Row, Select, Space, Switch } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { useGetDateTimeBusinessHour, wrapperPopup } from 'components/blaise'
import { QueryDeadball } from './query'
import DropdownSelectView from './dropdown-select-view'
import TableDeadball1X2AHOU from './table-deadball-1x2ahou'
import TableDeadballOE from './table-deadball-oe'
import TableDeadballDCML from './table-deadball-dcml'
import TableDeadballTG from './table-deadball-tg'
import TableDeadballCS from './table-deadball-cs'
import TableDeadballFGLG from './table-deadball-fglg'
import TableDeadballHTFT from './table-deadball-htft'
import TableDeadballOUT from './table-deadball-out'
import TablePaused from '../shared-components/deadball-runningball/table-paused'
import 'pages/trading/shared-components/trading.scss'

const intervalOptions = [
  { label: 'None', value: 0 },
  { label: '3s', value: 3 },
  { label: '5s', value: 5 },
  { label: '10s', value: 10 },
]
const isMatchConfirmedOptions = [
  { label: 'All Matches', value: '' },
  { label: 'Confirmed', value: 'Y' },
  { label: 'Unconfirmed', value: 'N' },
]

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()
  if (!defaultDateTime) return null
  return <Component {...props} defaultDateTime={defaultDateTime} />
}

const TradingDeadball = wrapperDate(({ popup_id, defaultDateTime }) => {
  const tableRef = React.useRef(null)
  const [currSearchIndex, setCurrSearchIndex] = React.useState(-1)
  const [viewParameter, setViewParameter] = React.useState({
    popup_id,
    match_time_slot: 'Today',
    game_type_deadball: 'DBAHOU',
    is_match_confirmed: '',
    is_show_in_active: false,
    sport_id: 10,
    interval: 3,
    early_date: [defaultDateTime, defaultDateTime.clone().add(1, 'day')],
  })

  const { sportOptions } = useSelectOptions()

  const { data = {}, isFetching, refetch } = QueryDeadball({
    ...viewParameter,
    from_early_date: viewParameter.early_date?.[0].format('YYYY-MM-DD'),
    to_early_date: viewParameter.early_date?.[1].format('YYYY-MM-DD'),
    is_show_in_active: viewParameter.is_show_in_active ? 'Y' : 'N',
  })

  const onValuesChange = (changedValues, values) => {
    setViewParameter(prev => ({ ...prev, ...values }))
  }

  const TableDeadball = getRenderTableDeadball(data.lastFetchGameType)
  return (
    <>
      <Row justify="space-between" align="top">
        <Col>
          <Space align="start">
            <DropdownSelectView
              viewParameter={viewParameter}
              onValuesChange={onValuesChange}
              callbackSubmit={refetch}
            />
            <Button size="small" loading={isFetching} icon={<ReloadOutlined />} onClick={refetch}>
              Refresh
            </Button>
            <Form initialValues={viewParameter} onValuesChange={onValuesChange}>
              <Space align="start">
                <Form.Item name="interval">
                  <Select style={{ width: 75 }} options={intervalOptions} />
                </Form.Item>
                {viewParameter.game_type_deadball === 'DBOUT' ? (
                  <Form.Item name="sport_id">
                    <Select style={{ width: 100 }} options={sportOptions} />
                  </Form.Item>
                ) : (
                  <Form.Item name="is_match_confirmed">
                    <Select style={{ width: 100 }} options={isMatchConfirmedOptions} />
                  </Form.Item>
                )}
                <Form.Item name="is_show_in_active" label="Inactive" valuePropName="checked">
                  <Switch checkedChildren="Show" unCheckedChildren="Hide" />
                </Form.Item>
              </Space>
            </Form>
          </Space>
        </Col>
        <Space>
          <TablePaused
            {...data}
            tableRef={tableRef}
            pausedMatches={data.pausedMatches}
            setCurrSearchIndex={setCurrSearchIndex}
            currSearchIndex={currSearchIndex}
          />
          <div>
            <b>Legend:</b>
            <br />
            <div className="px-1 tr-match-off" style={{ width: 100 }}>
              Match Closed
            </div>
            <div className="px-1 td-sub-match-off" style={{ width: 100 }}>
              Sub Match Closed
            </div>
            <div className="px-1 tr-match-paused" style={{ width: 100 }}>
              Match Paused
            </div>
            <div className="px-1 td-sub-match-paused" style={{ width: 100 }}>
              Sub Match Paused
            </div>
          </div>
        </Space>
      </Row>
      {viewParameter.game_type_deadball === data.lastFetchGameType && (
        <TableDeadball
          // loading={isFetching}
          refetch={refetch}
          dataSource={data.tableData}
          id="table-trading"
          bordered
          pagination={false}
          virtual
          scroll={scroll}
          rowClassName={rowClassName}
          currSearchIndex={currSearchIndex}
          ref={tableRef}
        />
      )}
    </>
  )
})

const scroll = {
  y: 570,
}
const rowClassName = x => {
  if (x.league_group) return 'separator-league-color'

  if (x.match_pause_status === 1) return 'tr-match-paused'
  if (x.match_open_status === 'N') return 'tr-match-off'
  return x.rowNumber % 2 !== 0 ? 'tr-odd' : 'tr-even'
}

const getRenderTableDeadball = gameType => {
  switch (gameType) {
    case 'DBAHOU':
      return TableDeadball1X2AHOU
    case 'DBOE':
      return TableDeadballOE
    case 'DBDCML':
      return TableDeadballDCML
    case 'DBTG':
      return TableDeadballTG
    case 'DBCS':
    case 'DBFHCS':
      return TableDeadballCS
    case 'DBFGLG':
      return TableDeadballFGLG
    case 'DBHTFT':
      return TableDeadballHTFT
    case 'DBOUT':
      return TableDeadballOUT
    default:
      return null
  }
}

export default wrapperPopup(TradingDeadball)
