import React from 'react'
import { Button, Modal } from 'antd'
import Content from './content'

const SettingOutrightButton = ({ record, successCallback }) => {
  const [visible, setVisible] = React.useState(false)

  const wrappedCallback = React.useCallback(() => {
    successCallback()
    setVisible(false)
  }, [successCallback])

  return (
    <>
      <Button type="link" className="p-0 btn_plain" onClick={() => setVisible(true)}>
        Setting
      </Button>
      {visible && (
        <Modal
          title={`Settings - ${record.league_name}`}
          open={visible}
          onCancel={() => setVisible(false)}
          destroyOnClose
          width={300}
          footer={null}
        >
          <Content record={record} successCallback={wrappedCallback} />
        </Modal>
      )}
    </>
  )
}

export default SettingOutrightButton
