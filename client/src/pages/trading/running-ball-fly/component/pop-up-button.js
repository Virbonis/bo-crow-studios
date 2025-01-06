import React, { useState } from 'react'
import { Button, Drawer, Space } from 'antd'
import RunningBallQuickFly from 'pages/trading/running-ball-quick-fly'

const PopUpButton = ({ record }) => {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <Button type="link" className="p-0 btn_plain text-primary" onClick={() => setVisible(true)}>
        Pop Up
      </Button>
      <Drawer
        title="Running Ball Quick"
        width="80%"
        open={visible}
        onClose={() => setVisible(false)}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisible(false)}>Close</Button>
          </Space>
        }
      >
        <RunningBallQuickFly match_id={record.match_id} />
      </Drawer>
    </>
  )
}

export default PopUpButton
