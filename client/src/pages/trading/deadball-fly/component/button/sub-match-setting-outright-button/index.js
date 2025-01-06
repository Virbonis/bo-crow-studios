import React from 'react'
import { Button, Modal } from 'antd'
import { Amount } from 'components/blaise'
import Content from './content'

const SubMatchSettingOutrightButton = ({ record, successCallback }) => {
  const { outright_id, odds } = record
  const [visible, setVisible] = React.useState(false)

  const wrappedCallback = React.useCallback(() => {
    successCallback()
    setVisible(false)
  }, [successCallback])

  return (
    <>
      <Button type="link" className="p-0 btn_plain" onClick={() => setVisible(true)}>
        <Amount value={odds} />
      </Button>
      <Modal
        title={`Odds :: ${record.league_name}`}
        open={visible}
        onCancel={() => setVisible(false)}
        width={600}
        destroyOnClose
        footer={null}
      >
        <Content outright_id={outright_id} successCallback={wrappedCallback} />
      </Modal>
    </>
  )
}

export default SubMatchSettingOutrightButton
