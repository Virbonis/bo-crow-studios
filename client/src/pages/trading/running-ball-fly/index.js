import { Button, Form, Switch, Select, Space, Row } from 'antd'
import React from 'react'
import { ReloadOutlined } from '@ant-design/icons'
import { debounce } from 'lodash'
import QueryRunningBall from './query'
import DivOptions from './component/div-options'
import TableRunningBall from './table-running-ball'
import TablePaused from '../shared-components/deadball-runningball/table-paused'
import 'pages/trading/shared-components/trading.scss'

const timerOptions = [
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

const TradingRunningBall = () => {
  const [form] = Form.useForm()
  const tableRef = React.useRef(null)
  const [currSearchIndex, setCurrSearchIndex] = React.useState(-1)
  const [viewParameter, setViewParameter] = React.useState({
    is_match_confirmed: '',
    is_show_in_active: false,
    interval: 3,
  })

  const { data = {}, isFetching, refetch } = QueryRunningBall({
    is_show_in_active: viewParameter.is_show_in_active ? 'Y' : 'N',
    is_match_confirmed: viewParameter.is_match_confirmed,
    interval: viewParameter.interval,
  })

  const onValuesChange = (changedValues, values) =>
    setViewParameter(prev => ({ ...prev, ...values }))

  return (
    <>
      <Row justify="space-between" align="top">
        <Space align="start">
          <DivOptions
            viewParameter={viewParameter}
            onValuesChange={onValuesChange}
            callbackSubmit={refetch}
            isMatchConfirmedOptions={isMatchConfirmedOptions}
          />
          <Button size="small" loading={isFetching} icon={<ReloadOutlined />} onClick={refetch}>
            Refresh
          </Button>
          <Form
            form={form}
            initialValues={viewParameter}
            onValuesChange={debounce(onValuesChange, 500)}
          >
            <Space align="start">
              <Form.Item name="interval">
                <Select style={{ width: 75 }} options={timerOptions} />
              </Form.Item>
              <Form.Item name="is_show_in_active" label="Inactive" valuePropName="checked">
                <Switch checkedChildren="Show" unCheckedChildren="Hide" />
              </Form.Item>
            </Space>
          </Form>
        </Space>
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
      <TableRunningBall // loading={isFetching}
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
    </>
  )
}
const scroll = {
  y: 570,
}
const rowClassName = x => {
  if (x.league_group) return 'separator-league-color'

  if (x.match_pause_status === 1) return 'tr-match-paused'
  if (x.match_open_status === 'N') return 'tr-match-off'
  return x.rowNumber % 2 !== 0 ? 'tr-odd' : 'tr-even'
}

export default TradingRunningBall
