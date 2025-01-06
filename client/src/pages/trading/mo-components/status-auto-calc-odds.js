import React from 'react'
import { connect } from 'react-redux'
import { Checkbox } from 'antd'
import actions from 'redux/mo5/actions'

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  ChangeAutoCalcOdds1X2: payload => {
    dispatch({
      type: actions.CHANGE_AUTO_CALC_ODDS_1X2,
      payload,
      successCallback,
    })
  },
})
const StatusAutoCalcOdds1X2 = React.memo(
  ({ ChangeAutoCalcOdds1X2, match_id, sub_match_id, game_type, st_auto_calc_odds, textOnly }) => {
    if (textOnly)
      return <input type="checkbox" checked={st_auto_calc_odds === 'Y'} disabled={textOnly} />

    const onChangeStatus = e => {
      ChangeAutoCalcOdds1X2({
        match_id,
        sub_match_id,
        game_type,
        auto_call_odds_status: e.target.checked ? 'Y' : 'N',
      })
    }

    return (
      <Checkbox checked={st_auto_calc_odds === 'Y'} onChange={onChangeStatus} disabled={textOnly} />
    )
  },
)

export default connect(null, mapDispatchToProps)(StatusAutoCalcOdds1X2)
