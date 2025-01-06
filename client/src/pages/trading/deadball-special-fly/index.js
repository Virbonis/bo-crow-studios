import React from 'react'
import { Button, Col, Form, Row, Select, Space, Switch } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { wrapperPopup, useGetDateTimeBusinessHour } from 'components/blaise'
import { debounce } from 'lodash'
import { QueryDeadballSpecial } from './query'
import DropdownSelectView from './dropdown-select-view'
import TableDeadballSpecial from './component/table-deadball-special'
import 'pages/trading/shared-components/trading.scss'

const intervalOptions = [
  { label: 'None', value: 0 },
  { label: '3s', value: 3 },
  { label: '5s', value: 5 },
  { label: '10s', value: 10 },
]

const wrapperDate = Component => props => {
  const defaultDate = useGetDateTimeBusinessHour()
  if (!defaultDate) return null
  return <Component defaultDate={defaultDate} {...props} />
}
const TradingDeadballSpecial = wrapperDate(({ popup_id, defaultDate }) => {
  const [viewParameter, setViewParameter] = React.useState({
    popup_id,
    in_game_type: '20,41,22', // BTTS, 2BTTS, PA
    match_time_slot: 'Today',
    is_show_in_active: false,
    interval: 3,
    early_date: [defaultDate, defaultDate.clone().add(1, 'day')],
  })

  const { data = {}, isFetching, refetch } = QueryDeadballSpecial({
    ...viewParameter,
    from_early_date: viewParameter.early_date[0].format('YYYY-MM-DD'),
    to_early_date: viewParameter.early_date[1].format('YYYY-MM-DD'),
    is_show_in_active: viewParameter.is_show_in_active ? 'Y' : 'N',
  })

  const onValuesChange = (changedValues, values) =>
    setViewParameter(prev => ({ ...prev, ...values }))

  return (
    <>
      <Row justify="space-between">
        <Col>
          <Space align="start">
            <DropdownSelectView
              viewParameter={viewParameter}
              onValuesChange={onValuesChange}
              refetch={refetch}
            />
            <Button size="small" loading={isFetching} icon={<ReloadOutlined />} onClick={refetch}>
              Refresh
            </Button>
            <Form initialValues={viewParameter} onValuesChange={debounce(onValuesChange, 500)}>
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
        </Col>
        <Col>
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
        </Col>
      </Row>
      {viewParameter.in_game_type === data.lastFetchGameType && (
        <TableDeadballSpecial
          data={data.tableData}
          refetch={refetch}
          lastFetchGameType={data.lastFetchGameType}
        />
      )}
    </>
  )
})

export default wrapperPopup(TradingDeadballSpecial)
