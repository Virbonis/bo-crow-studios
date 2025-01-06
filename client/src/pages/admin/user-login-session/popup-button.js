import { Button } from 'antd'
import { DragableModal } from 'components/blaise'
import React from 'react'
import Popup from './popup'

const PopUpButton = ({ username }) => {
  const [visible, setVisible] = React.useState(false)

  return (
    <>
      <Button type="text p-0" className="text-primary" onClick={() => setVisible(true)}>
        {username}
      </Button>
      <DragableModal
        title={`User - ${username}`}
        width="40%"
        open={visible}
        destroyOnClose
        center
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Popup username={username} />
      </DragableModal>
    </>
  )
}

export default PopUpButton
