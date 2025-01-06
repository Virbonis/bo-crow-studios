import React, { useState } from 'react'
import { Button, Modal } from 'antd'
import EditHandicap from './edit-handicap'

const HandicapButton = ({ record, children, successCallback }) => {
  const [visible, setVisible] = useState(false)

  const displayHandicap = getButtonType(record, children, setVisible)
  return (
    <>
      {displayHandicap}
      {visible && (
        <Modal
          title="Change Handicap and Odds"
          open={visible}
          onCancel={() => setVisible(false)}
          focusTriggerAfterClose={false}
          autoFocusButton={null}
          destroyOnClose
          okText="Submit"
          width="30%"
          footer={
            record.match_time_slot !== 'Started' && (
              <Button htmlType="submit" form="edit-handicap-form" type="primary">
                Submit
              </Button>
            )
          }
        >
          <EditHandicap
            editValue={record}
            successCallback={() => {
              setVisible(false)
              successCallback()
            }}
          />
        </Modal>
      )}
    </>
  )
}

// this will show either the handicap text or the button to allow editing
const getButtonType = (record, children, setVisible) => {
  const isSoccer = record.sport_id === 10

  const { handicap, game_type, sub_match_fav_status } = record
  switch (game_type) {
    // HDP / OU
    case 0:
    case 5:
    case 2:
    case 6:
      // kalo hdp/ou soccer ga bisa edit
      if (isSoccer)
        return (
          <>
            {sub_match_fav_status === 1 && <br />}
            <span className="font-weight-bold">{Math.abs(handicap)}</span>
          </>
        )
      return (
        <button
          type="button"
          className="p-0 btn_plain font-weight-bold"
          onClick={() => setVisible(true)}
        >
          {sub_match_fav_status === 1 && <br />}
          {Math.abs(handicap)}
        </button>
      )
    // OE
    case 3:
    case 16:
      return (
        <button
          type="button"
          className="p-0 btn_plain font-weight-bold"
          onClick={() => setVisible(true)}
        >
          <span>O</span> <br />
          <span>E</span>
        </button>
      )
    // HWNW / AWNW
    case 63:
    case 64:
      return (
        <>
          <span>W</span> <br />
          <span>NW</span>
        </>
      )
    // DC
    case 15:
      return children
    // ML
    case 12:
    case 17:
      return (
        <button
          type="button"
          className="p-0 btn_plain font-weight-bold"
          onClick={() => setVisible(true)}
        >
          {children}
        </button>
      )
    default:
      return null
  }
}

export default HandicapButton
