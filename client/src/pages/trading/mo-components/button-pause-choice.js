import { Button } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
// import { Checkbox } from 'antd'
import actions from 'redux/mo5/actions'

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  PauseResumeChoice: payload => {
    dispatch({
      type: actions.PAUSE_RESUME_CHOICE,
      payload,
      successCallback,
    })
  },
})

const ButtonPauseChoice = React.memo(
  ({ PauseResumeChoice, match_id, game_type, choice_code, st_pause }) => {
    const classNamePause = st_pause > 0 ? 'blink_on' : 'blink_off'
    const onClickPause = () => {
      PauseResumeChoice({
        match_id,
        game_type,
        choice_code,
        choice_pause_status: st_pause > 0 ? 0 : 3,
      })
    }

    return (
      <Button size="small" type="text" className="p-0" onClick={onClickPause}>
        <div className={`${classNamePause}`} />
      </Button>
    )
    // return <Checkbox checked={st_pause === 3} onChange={onChangeStatus} />
  },
)

export default connect(null, mapDispatchToProps)(ButtonPauseChoice)
