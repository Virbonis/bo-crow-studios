import React from 'react'
import { Button, Form, Select, Space } from 'antd'
import DrawerSelectLeague from 'pages/trading/drawer-select-league'
import DrawerSelectMatch from 'pages/trading/drawer-select-match'

const statusLiveOptions = [
  { label: 'Live + Today', value: 'Live-Today' },
  { label: 'Live', value: 'Live' },
  { label: 'Today', value: 'Today' },
  { label: 'Early', value: 'Early' },
]

const DropdownSelectView = ({ viewParameter, onValuesChange, refetch }) => {
  const [visibleDrawer, setVisibleDrawer] = React.useState()
  const closeDrawer = React.useCallback(() => setVisibleDrawer(null), [])

  const { popup_id, match_time_slot } = viewParameter
  return (
    <div style={{ width: 175 }}>
      <Form initialValues={viewParameter} onValuesChange={onValuesChange}>
        <Form.Item name="match_time_slot">
          <Select className="w-100" options={statusLiveOptions} />
        </Form.Item>
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
        group={`Forecast-${match_time_slot}`}
        callbackSubmit={refetch}
      />
      <DrawerSelectMatch
        open={visibleDrawer === 'match'}
        closeDrawer={closeDrawer}
        popup_id={popup_id}
        group={`Forecast-${match_time_slot}`}
        callbackSubmit={refetch}
      />
    </div>
  )
}

export default DropdownSelectView
