import { Button, Select, Space, DatePicker, Form } from 'antd'
import DrawerSelectLeague from 'pages/trading/drawer-select-league'
import DrawerSelectMatch from 'pages/trading/drawer-select-match'
import React from 'react'

const statusLiveOptions = [
  { label: 'Live', value: 'Live' },
  { label: 'Today', value: 'Today' },
  { label: 'Early', value: 'Early' },
]

const { RangePicker } = DatePicker
const DropdownSelectView = ({ viewParameter, onValuesChange, callbackSubmit }) => {
  const [visibleDrawer, setVisibleDrawer] = React.useState()
  const closeDrawer = React.useCallback(() => setVisibleDrawer(null), [])

  const { popup_id, match_time_slot, early_date } = viewParameter
  return (
    <div style={{ width: 175 }}>
      <Form initialValues={viewParameter} onValuesChange={onValuesChange}>
        <Form.Item name="match_time_slot">
          <Select className="w-100" options={statusLiveOptions} />
        </Form.Item>
        {match_time_slot === 'Early' && (
          <Form.Item name="early_date">
            <RangePicker className="w-100" format="YYYY-MMM-DD" allowClear={false} />
          </Form.Item>
        )}
        <Space>
          <Button onClick={() => setVisibleDrawer('league')} className="w-100">
            Select League
          </Button>
          <Button onClick={() => setVisibleDrawer('match')} className="w-100">
            Select Match
          </Button>
        </Space>
      </Form>
      <DrawerSelectLeague
        os="N"
        open={visibleDrawer === 'league'}
        closeDrawer={closeDrawer}
        popup_id={popup_id}
        group={match_time_slot}
        early_date={early_date}
        callbackSubmit={callbackSubmit}
      />
      <DrawerSelectMatch
        open={visibleDrawer === 'match'}
        closeDrawer={closeDrawer}
        popup_id={popup_id}
        group={match_time_slot}
        early_date={early_date}
        callbackSubmit={callbackSubmit}
      />
    </div>
  )
}

export default DropdownSelectView
