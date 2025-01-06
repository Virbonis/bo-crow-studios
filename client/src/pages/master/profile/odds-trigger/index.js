import React from 'react'
import { Button, Tooltip, Drawer, Space } from 'antd'
import Content from './content'

const OddsTrigger = ({ record, title }) => {
  const [visible, setVisible] = React.useState(false)
  return (
    <>
      <Tooltip title="Edit">
        <Button type="link" onClick={() => setVisible(true)}>
          Odds
        </Button>
      </Tooltip>
      <Drawer
        title={title}
        width={720}
        open={visible}
        onClose={() => setVisible(false)}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisible(false)}>Cancel</Button>
            <Button form="edit-form" type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        }
      >
        <Content
          oddsTriggerValue={record}
          successCallback={() => {
            setVisible(false)
          }}
        />
      </Drawer>
    </>
  )
}

export default OddsTrigger
