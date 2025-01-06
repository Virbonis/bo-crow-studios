import { Button, Form, Select, Space } from 'antd'
import DrawerSelectLeague from 'pages/trading/drawer-select-league'
import DrawerSelectMatch from 'pages/trading/drawer-select-match'
import React from 'react'

const DivOptions = ({ onValuesChange, viewParameter, isMatchConfirmedOptions, callbackSubmit }) => {
  const [visibleDrawer, setVisibleDrawer] = React.useState()
  const closeDrawer = React.useCallback(() => setVisibleDrawer(null), [])

  return (
    <>
      <div style={{ width: 175 }}>
        <Space>
          <Space>
            <Button size="small" onClick={() => setVisibleDrawer('league N')}>
              Select League
            </Button>
            <Button size="small" onClick={() => setVisibleDrawer('match')}>
              Select Match
            </Button>
          </Space>
        </Space>
        <Form initialValues={viewParameter} onValuesChange={onValuesChange}>
          <Form.Item name="is_match_confirmed">
            <Select className="w-100" options={isMatchConfirmedOptions} />
          </Form.Item>
        </Form>
      </div>
      <DrawerSelectLeague
        os={visibleDrawer?.split(' ')[1]}
        open={visibleDrawer?.split(' ')[0] === 'league'}
        closeDrawer={closeDrawer}
        group="RunningBall"
        callbackSubmit={callbackSubmit}
      />
      <DrawerSelectMatch
        open={visibleDrawer === 'match'}
        closeDrawer={closeDrawer}
        group="RunningBall"
        callbackSubmit={callbackSubmit}
      />
    </>
  )
}

export default DivOptions
