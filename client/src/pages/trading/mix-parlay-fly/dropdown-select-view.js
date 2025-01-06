import React from 'react'
import { Button, DatePicker, Form, Select, Space } from 'antd'
import { debounce } from 'lodash'
import DrawerSelectLeague from 'pages/trading/drawer-select-league'
import DrawerSelectMatch from 'pages/trading/drawer-select-match'

const statusLiveOptions = [
  { label: 'RunningBall', value: 'RunningBall' },
  { label: 'Today', value: 'Today' },
  { label: 'Early', value: 'Early' },
]

const { RangePicker } = DatePicker
const DropdownSelectView = ({ viewParameter, setViewParameter, refetch }) => {
  const [visibleDrawer, setVisibleDrawer] = React.useState()
  const closeDrawer = React.useCallback(() => setVisibleDrawer(null), [])

  const onValuesChange = (changedValues, values) =>
    setViewParameter(prev => ({ ...prev, ...values }))

  const { popup_id, match_time_slot, early_date } = viewParameter
  return (
    <div style={{ width: 175 }}>
      <Form initialValues={viewParameter} onValuesChange={debounce(onValuesChange, 500)}>
        <Form.Item name="match_time_slot">
          <Select className="w-100" options={statusLiveOptions} />
        </Form.Item>
        {match_time_slot === 'Early' && (
          <Form.Item name="early_date">
            <RangePicker allowClear={false} className="w-100" format="YYYY-MM-DD" />
          </Form.Item>
        )}
      </Form>
      <Space>
        <Button onClick={() => setVisibleDrawer('league')} className="w-100">
          Select League
        </Button>
        <Button onClick={() => setVisibleDrawer('match')} className="w-100">
          Select Match
        </Button>
      </Space>
      <DrawerSelectLeague
        os="N"
        open={visibleDrawer === 'league'}
        closeDrawer={closeDrawer}
        popup_id={popup_id}
        group={match_time_slot}
        early_date={early_date}
        callbackSubmit={refetch}
      />
      <DrawerSelectMatch
        open={visibleDrawer === 'match'}
        closeDrawer={closeDrawer}
        popup_id={popup_id}
        group={match_time_slot}
        early_date={early_date}
        callbackSubmit={refetch}
      />
    </div>
  )
}

export default DropdownSelectView
