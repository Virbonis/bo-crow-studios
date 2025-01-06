import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/trading-floor/actions'

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  UpdateOpenCloseMatch: payload => {
    dispatch({
      type: actions.UPDATE_OPEN_CLOSE_MATCH,
      payload,
      successCallback,
      source: 'Trading Floor',
    })
  },
  UpdatePauseResumeMatch: payload => {
    dispatch({
      type: actions.UPDATE_PAUSE_RESUME_MATCH,
      payload,
      successCallback,
      source: 'Trading Floor',
    })
  },
})
const OpenCloseMatchButton = ({ record, UpdateOpenCloseMatch, UpdatePauseResumeMatch }) => {
  const { match_id, match_open_status } = record
  const OpenCloseMatchHandler = value =>
    UpdateOpenCloseMatch({
      match_id,
      match_open_status: value,
    })

  const PauseResumeMatchHandler = value =>
    UpdatePauseResumeMatch({
      match_id,
      sub_match_pause_id: value,
    })

  return (
    <>
      {match_open_status === 'Y' ? (
        <button
          type="button"
          className="text-danger p-0 btn_plain"
          onClick={() => OpenCloseMatchHandler('N')}
        >
          Cls
        </button>
      ) : (
        <button
          type="button"
          className="text-success p-0 btn_plain"
          onClick={() => OpenCloseMatchHandler('Y')}
        >
          Opn
        </button>
      )}
      <div>
        <button
          type="button"
          className="text-danger p-0 btn_plain"
          onClick={() => PauseResumeMatchHandler(3)} // Pause
        >
          Pse
        </button>
        /
        <button
          type="button"
          className="text-success p-0 btn_plain"
          onClick={() => PauseResumeMatchHandler(0)} // Resume
        >
          Rsm
        </button>
      </div>
    </>
  )
}

export default connect(null, mapDispatchToProps)(OpenCloseMatchButton)
