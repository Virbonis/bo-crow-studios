import React from 'react'
import { connect } from 'react-redux'
import { InputNumber } from 'antd'
import actions from 'redux/mo5/actions'

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  ChangeOddsEuro: payload => {
    dispatch({
      type: actions.CHANGE_ODDS_EURO,
      payload,
      successCallback,
    })
  },
})
const InputOddsEuro = React.memo(({ ChangeOddsEuro, match_id, sub_match_id, odds }) => {
  odds *= -1

  const className = odds < 0 ? 'text-red' : ''
  const onChangeOdds = e => {
    const newOdds = e.target.value
    ChangeOddsEuro({
      match_id,
      sub_match_id,
      odds: parseFloat(newOdds),
    })
    inputRef.current.blur()
  }

  const [isFocus, setIsFocus] = React.useState(false)
  const inputRef = React.useRef(null)
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

/**
 * Returns input field for odds within direct update when value is changed
 * @param {int} match_id
 * @param {int} sub_match_id
 * @param {decimal} odds
 * @param {function} successCallback
 */
export default connect(null, mapDispatchToProps)(InputOddsEuro)
