import React from 'react'
import { connect } from 'react-redux'
import actionsMO from 'redux/mo5/actions'
import actionsMOOGT from 'redux/mo-other-game-type/actions'

// frompage = MOAHOU/MOTENNIS

const mapDispatchToProps = dispatch => ({
  PauseResumeMatch: (payload, successCallback) => {
    dispatch({
      type: actionsMO.PAUSE_RESUME_MATCH,
      payload,
      successCallback,
    })
  },
  UpdateOGTPauseResumeAll: (payload, successCallback) => {
    dispatch({
      type: actionsMOOGT.UPDATE_MORE_STATUS_PAUSE_ALL,
      payload,
      successCallback,
    })
  },
})

const StatusPause = ({
  match_id,
  st_pause,
  tableRef,
  textOnly,
  frompage = 'MOAHOU',
  successCallback,
  PauseResumeMatch,
  UpdateOGTPauseResumeAll,
}) => {
  if (textOnly) return <input type="checkbox" checked={st_pause === 1} disabled={textOnly} />

  return (
    <input
      type="checkbox"
      checked={st_pause === 1}
      onChange={e => {
        const { popup_id, match_time_slot } = tableRef.current.viewParameter
        PauseResumeMatch(
          {
            popup_id,
            match_time_slot,
            match_id,
            match_pause_status: e.target.checked ? 1 : 0,
            mo_page: frompage,
          },
          successCallback,
        )

        // Pause/Resume all OGT
        UpdateOGTPauseResumeAll({
          match_id,
          status: e.target.checked ? 3 : 0,
        })
      }}
      disabled={textOnly}
    />
  )
}

export default connect(null, mapDispatchToProps)(StatusPause)
