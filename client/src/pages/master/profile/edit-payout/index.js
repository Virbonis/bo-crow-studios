import React from 'react'
import { Button, Tooltip, Drawer, Space } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import Content from './content'

const EditPayout = ({ record, refresh }) => {
  const [visible, setVisible] = React.useState(false)
  return (
    <>
      <Tooltip title="Edit">
        <Button type="link" icon={<EditOutlined />} onClick={() => setVisible(true)} />
      </Tooltip>
      <Drawer
        title="Edit Payout"
        width={420}
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
          editValue={record}
          successCallback={() => {
            setVisible(false)
            refresh()
          }}
        />
      </Drawer>
    </>
  )
}

export default EditPayout
