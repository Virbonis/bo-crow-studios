import React from 'react'
import { connect } from 'react-redux'
import { Checkbox } from 'antd'
import actions from 'redux/mo5/actions'

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  OpenCloseChoice: payload => {
    dispatch({
      type: actions.OPEN_CLOSE_CHOICE,
      payload,
      successCallback,
    })
  },
})
const StatusOpenChoice = React.memo(
  ({ OpenCloseChoice, match_id, game_type, choice_code, st_open }) => {
    const onChangeStatus = e => {
      OpenCloseChoice({
        match_id,
        game_type,
        choice_code,
        choice_open_status: e.target.checked ? 'N' : 'Y',
      })
    }

    return <Checkbox checked={st_open === 'N'} onChange={onChangeStatus} />
  },
)

export default connect(null, mapDispatchToProps)(StatusOpenChoice)
