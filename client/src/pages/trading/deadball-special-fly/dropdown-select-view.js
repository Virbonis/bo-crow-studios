import React from 'react'
import { Button, DatePicker, Form, Select, Space } from 'antd'
import DrawerSelectLeague from 'pages/trading/drawer-select-league'
import DrawerSelectMatch from 'pages/trading/drawer-select-match'

const statusLiveOptions = [
  { label: 'Today', value: 'Today' },
  { label: 'Early', value: 'Early' },
  { label: 'Settled', value: 'Started' },
]
const inGameTypeOptions = [
  {
    value: '20,41,22',
    label: 'BTTS, 2BTTS, PA',
  },
  {
    value: '37,38,28',
    label: 'HNB, ANB, DNB',
  },
  {
    value: '23,24,33,34',
    label: 'RT2G, RT3G, TWFB, TWTN',
  },
  {
    value: '42,43,44,45',
    label: 'HWEH, AWEH, HWBH, AWBH',
  },
  {
    value: '46,47,26',
    label: 'HSBH, ASBH, TSBH',
  },
  {
    value: '48,49,30,29',
    label: 'HSHHT, HSHAT, HSH, HWMC',
  },
  { value: '40', label: 'CSH' },
  { value: '39', label: '3WH' },
  { value: '21', label: 'FGM' },
  { value: '25', label: 'TOTFG' },
  { value: '27', label: 'ITA' },
  { value: '35', label: 'WM' },
]
const { RangePicker } = DatePicker
const DropdownSelectView = ({ viewParameter, onValuesChange, refetch }) => {
  const [visibleDrawer, setVisibleDrawer] = React.useState()
  const closeDrawer = React.useCallback(() => setVisibleDrawer(null), [])

  const { popup_id, match_time_slot, early_date } = viewParameter
  return (
    <div style={{ width: 175 }}>
      <Form initialValues={viewParameter} onValuesChange={onValuesChange}>
        <Form.Item name="in_game_type">
          <Select className="w-100" options={inGameTypeOptions} />
        </Form.Item>
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
