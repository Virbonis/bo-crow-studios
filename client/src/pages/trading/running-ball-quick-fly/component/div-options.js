import { Button, Form, Select, Space } from 'antd'
import DrawerSelectLeague from 'pages/trading/drawer-select-league'
import DrawerSelectMatch from 'pages/trading/drawer-select-match'
import React from 'react'
import { connect } from 'react-redux'

const DivOptions = ({ matchOptions, viewParameter, onValuesChange, refetch }) => {
  const [visibleDrawer, setVisibleDrawer] = React.useState()
  const closeDrawer = React.useCallback(() => setVisibleDrawer(null), [])

  const [form] = Form.useForm()
  React.useEffect(() => form.resetFields(), [form, viewParameter])

  // const sortedMatchOptions = matchOptions.sort((a, b) => a.no_display_match - b.no_display_match)
  return (
    <>
      <div style={{ width: 175 }}>
        <Space>
          <Button onClick={() => setVisibleDrawer('league N')} className="w-100">
            Select League
          </Button>
          <Button onClick={() => setVisibleDrawer('match')} className="w-100">
            Select Match
          </Button>
        </Space>
        <Form form={form} initialValues={viewParameter} onValuesChange={onValuesChange}>
          <Form.Item name="match_id">
            <Select className="w-100" options={matchOptions} placeholder="There is no live match" />
          </Form.Item>
        </Form>
      </div>
      <DrawerSelectLeague
        os={visibleDrawer?.split(' ')[1]}
        open={visibleDrawer?.split(' ')[0] === 'league'}
        closeDrawer={closeDrawer}
        group="RunningBall"
        callbackSubmit={refetch}
      />
      <DrawerSelectMatch
        open={visibleDrawer === 'match'}
        closeDrawer={closeDrawer}
        group="RunningBall"
        callbackSubmit={refetch}
      />
    </>
  )
}

export default connect(null, null)(DivOptions)
