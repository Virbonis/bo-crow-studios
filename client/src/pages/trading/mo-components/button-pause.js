import React from 'react'
import { connect } from 'react-redux'
import actionsMO from 'redux/mo5/actions'

const mapDispatchToProps = dispatch => ({
  PauseResumeSubMatch: (payload, successCallback) => {
    dispatch({
      type: actionsMO.PAUSE_RESUME_SUB_MATCH,
      payload,
      successCallback,
    })
  },
})

const ButtonPause = ({
  match_id,
  sub_match_id,
  game_type,
  st_pause,
  textOnly,
  PauseResumeSubMatch,
  successCallback,
}) => {
  const classNamePause = st_pause > 0 ? 'blink_on' : 'blink_off'
  if (textOnly) return <div className={classNamePause} />
  return (
    <button
      size="small"
      type="button"
      className="p-0 mo_btn_pause"
      onClick={() =>
        PauseResumeSubMatch(
          {
            match_id,
            sub_match_id,
            game_type,
            sub_match_pause_status: st_pause > 0 ? 0 : 3,
          },
          successCallback,
        )
      }
    >
      <div className={`${classNamePause}`} />
    </button>
  )
}
export default connect(null, mapDispatchToProps)(ButtonPause)
