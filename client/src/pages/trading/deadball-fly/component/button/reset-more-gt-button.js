import { Button } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import actionsTradingFloor from 'redux/trading-floor/actions'

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  ResetMatchMoreGT: payload => {
    dispatch({
      type: actionsTradingFloor.UPDATE_MATCH_MORE_GT,
      payload,
      successCallback,
      source: 'Trading Deadball',
    })
  },
})
const ResetMoreGTLeagueButton = ({ match_ids, ResetMatchMoreGT }) => {
  return (
    <Button type="primary" onClick={() => ResetMatchMoreGT({ match_ids, more_gt: 3 })}>
      Reset Game Type More by League
    </Button>
  )
}

export default connect(null, mapDispatchToProps)(ResetMoreGTLeagueButton)
