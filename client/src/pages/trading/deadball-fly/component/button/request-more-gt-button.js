import React from 'react'
import { connect } from 'react-redux'
import actionsTradingFloor from 'redux/trading-floor/actions'

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  RequestMatchMoreGT: payload => {
    dispatch({
      type: actionsTradingFloor.UPDATE_MATCH_MORE_GT,
      payload,
      successCallback,
      source: 'Trading Deadball',
    })
  },
})
const RequestMoreGTLeagueButton = ({ match_ids, RequestMatchMoreGT }) => {
  return (
    <button
      className="btn-primary"
      type="button"
      onClick={() => RequestMatchMoreGT({ match_ids, more_gt: 1 })}
    >
      Request Game Type More by League
    </button>
  )
}

export default connect(null, mapDispatchToProps)(RequestMoreGTLeagueButton)
