import React from 'react'
import { connect } from 'react-redux'
import { InputNumber, message } from 'antd'
import actions from 'redux/mo5/actions'
import { isOddsValid } from 'helper'

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  ChangeOddsCSLive: payload => {
    dispatch({
      type: actions.CHANGE_ODDS_CSLIVE,
      payload,
      successCallback,
    })
  },
})
const InputOddsCS = React.memo(({ ChangeOddsCSLive, match_id, game_type, choice_code, odds }) => {
  const className = odds < 0 ? 'text-red' : ''
  const onChangeOdds = e => {
    const newOdds = e.target.value

    if (validateOdds(newOdds, game_type)) {
      ChangeOddsCSLive({
        match_id,
        game_type,
        choice_code,
        odds: parseFloat(newOdds),
      })
      inputRef.current.blur()
    }
  }

  const inputRef = React.useRef(null)
  const [isFocus, setIsFocus] = React.useState(false)
  return (
    <InputNumber
      ref={inputRef}
      onClick={() => inputRef.current.select()}
      variant={isFocus ? 'outlined' : 'filled'}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      controls={false}
      value={Math.abs(odds)}
      onPressEnter={onChangeOdds}
      className={`${className} mo_input_number`}
    />
  )
})
const validateOdds = (odds, gameType) => {
  const [isValid, errMsg] = isOddsValid(odds, gameType)
  if (!isValid) message.warning(errMsg)
  return isValid
}

export default connect(null, mapDispatchToProps)(InputOddsCS)
