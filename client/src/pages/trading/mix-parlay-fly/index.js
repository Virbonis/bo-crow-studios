import React from 'react'
import { Button, Col, Form, Row, Select, Space, Switch } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { useGetDateTimeBusinessHour, wrapperPopup } from 'components/blaise'
import { debounce } from 'lodash'
import { QueryMixParlay } from './query'
import DropdownSelectView from './dropdown-select-view'
import TableMixParlay from './table-mix-parlay'
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
const TradingMixParlay = wrapperDate(({ popup_id, defaultDate }) => {
  const [viewParameter, setViewParameter] = React.useState({
    popup_id,
    match_time_slot: 'Today',
    is_show_non_parlay: false,
    interval: 5,
    early_date: [defaultDate, defaultDate.clone().add(1, 'day')],
  })

  const { data = [], isFetching, refetch } = QueryMixParlay({
    ...viewParameter,
    from_early_date: viewParameter.early_date[0].format('YYYY-MM-DD'),
    to_early_date: viewParameter.early_date[1].format('YYYY-MM-DD'),
    is_show_non_parlay: viewParameter.is_show_non_parlay ? 'Y' : 'N',
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
              setViewParameter={setViewParameter}
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
                <Form.Item name="is_show_non_parlay" label="Inactive" valuePropName="checked">
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
            <div className="px-1 tr-match-paused" style={{ width: '100px' }}>
              Match Paused
            </div>
            <div className="px-1 tr-match-off" style={{ width: '100px' }}>
              Match Closed
            </div>
            <div className="px-1 td-sub-match-off" style={{ width: '100px' }}>
              Parlay Off
            </div>
          </div>
        </Col>
      </Row>
      <TableMixParlay data={data} refetch={refetch} />
    </>
  )
})

export default wrapperPopup(TradingMixParlay)
