import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import actions from 'redux/trading-floor/actions'

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  UpdateConfirmOutright: payload => {
    dispatch({
      type: actions.UPDATE_TRADING_CONFIRM_OUTRIGHT,
      payload,
      successCallback,
      source: 'Trading Floor',
    })
  },
})

const ConfirmOutrightButton = ({ record, UpdateConfirmOutright }) => {
  const { is_match_confirmed, outright_id } = record
  return (
    is_match_confirmed === 'N' && (
      <div className="text-center">
        <Button
          onClick={() => UpdateConfirmOutright({ outright_id })}
          type="link"
          className="p-0 bg-orange"
        >
          Confirm!
        </Button>
      </div>
    )
  )
}

export default connect(null, mapDispatchToProps)(ConfirmOutrightButton)
