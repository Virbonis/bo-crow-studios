import { Button, message } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/mo5/actions'

const mapDispatchToProps = (dispatch, successCallback) => ({
  UpdateZeroOdds: payload => {
    dispatch({
      type: actions.UPDATE_ZERO_ODDS,
      payload,
      successCallback,
    })
  },
})

const ButtonZeroOdds = ({ UpdateZeroOdds, tableRef }) => {
  const onClickZeroOdds = () => {
    const { selectedRow } = tableRef.current
    if (!selectedRow) {
      message.warning('Please select 1 Record!')
      return
    }

    const {
      ArrMatch: { match_id },
    } = selectedRow
    UpdateZeroOdds({ match_id })
  }

  return (
    <>
      <Button size="small" onClick={onClickZeroOdds}>
        Zero Odds
      </Button>
    </>
  )
}

export default connect(null, mapDispatchToProps)(ButtonZeroOdds)
