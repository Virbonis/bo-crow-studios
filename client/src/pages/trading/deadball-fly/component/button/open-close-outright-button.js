import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import actions from 'redux/trading-floor/actions'

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  UpdateOpenCloseOutright: payload => {
    dispatch({
      type: actions.UPDATE_OPEN_CLOSE_OUTRIGHT,
      payload,
      successCallback,
      source: 'Trading Floor',
    })
  },
  UpdatePauseResumeOutright: payload => {
    dispatch({
      type: actions.UPDATE_PAUSE_RESUME_OUTRIGHT,
      payload,
      successCallback,
      source: 'Trading Floor',
    })
  },
})
const OpenCloseOutrightButton = ({
  record,
  UpdateOpenCloseOutright,
  UpdatePauseResumeOutright,
}) => {
  const { outright_id } = record
  const OpenCloseOutrightHandler = value =>
    UpdateOpenCloseOutright({
      outright_id,
      match_open_status: value,
    })

  const PauseResumeOutrightHandler = value =>
    UpdatePauseResumeOutright({
      outright_id,
      match_pause_status: value,
    })

  return (
    <>
      <div>
        <Button onClick={() => OpenCloseOutrightHandler('N')} type="link" className="text-danger">
          Close All
        </Button>
        /
        <Button onClick={() => OpenCloseOutrightHandler('Y')} type="link" className="text-success">
          Open All
        </Button>
      </div>
      <div>
        <Button onClick={() => PauseResumeOutrightHandler('Y')} type="link" className="text-danger">
          Pause All
        </Button>
        /
        <Button
          onClick={() => PauseResumeOutrightHandler('N')}
          type="link"
          className="text-success"
        >
          Resume All
        </Button>
      </div>
    </>
  )
}

export default connect(null, mapDispatchToProps)(OpenCloseOutrightButton)
