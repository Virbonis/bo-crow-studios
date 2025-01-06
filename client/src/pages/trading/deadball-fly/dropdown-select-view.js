import { Button, Select, Space, DatePicker, Form } from 'antd'
import DrawerSelectLeague from 'pages/trading/drawer-select-league'
import DrawerSelectMatch from 'pages/trading/drawer-select-match'
import React from 'react'

const statusLiveOptions = [
  { label: 'Today', value: 'Today' },
  { label: 'Early', value: 'Early' },
  { label: 'Settled', value: 'Started' },
]
const deadballGameTypeOptions = [
  {
    label: '1X2, Handicap, Over/Under',
    value: 'DBAHOU',
  },
  {
    label: 'Odd/Even, Win/Not Win (OE, HWNW, AWNW)',
    value: 'DBOE',
  },
  {
    label: 'Double Chance, Money Line (DC, ML)',
    value: 'DBDCML',
  },
  {
    label: 'Total Goal (TG) (HT/FT)',
    value: 'DBTG',
  },
  {
    label: 'Correct Score (CS)',
    value: 'DBCS',
  },
  {
    label: 'FH. Correct Score (FH.CS)',
    value: 'DBFHCS',
  },
  {
    label: 'First Goal/Last Goal (FGLG)',
    value: 'DBFGLG',
  },
  {
    label: 'Half Time/Full Time (HTFT)',
    value: 'DBHTFT',
  },
  {
    label: 'Outright',
    value: 'DBOUT',
  },
]

const { RangePicker } = DatePicker
const DropdownSelectView = ({ viewParameter, onValuesChange, callbackSubmit }) => {
  const [visibleDrawer, setVisibleDrawer] = React.useState()
  const closeDrawer = React.useCallback(() => setVisibleDrawer(null), [])

  const { popup_id, game_type_deadball, match_time_slot, early_date } = viewParameter
  return (
    <div style={{ width: 175 }}>
      <Form initialValues={viewParameter} onValuesChange={onValuesChange}>
        <Form.Item name="game_type_deadball">
          <Select className="w-100" options={deadballGameTypeOptions} />
        </Form.Item>
        {game_type_deadball !== 'DBOUT' && (
          <Form.Item name="match_time_slot">
            <Select className="w-100" options={statusLiveOptions} />
          </Form.Item>
        )}
        {game_type_deadball === 'DBOUT' || match_time_slot === 'Early' ? (
          <Form.Item name="early_date">
            <RangePicker className="w-100" format="YYYY-MMM-DD" allowClear={false} />
          </Form.Item>
        ) : null}
        {game_type_deadball !== 'DBOUT' && (
          <Space>
            <Button onClick={() => setVisibleDrawer('league')} className="w-100">
              Select League
            </Button>
            <Button onClick={() => setVisibleDrawer('match')} className="w-100">
              Select Match
            </Button>
          </Space>
        )}
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
