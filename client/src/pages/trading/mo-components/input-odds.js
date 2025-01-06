import React from 'react'
import { Space, message, InputNumber } from 'antd'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { usePopupID } from 'components/blaise/custom/wrapperPopup'
import { isOddsValid } from 'helper'
import { connect } from 'react-redux'
import actionsMO from 'redux/mo5/actions'

const mapDispatchToProps = dispatch => ({
  SwapOdds: (payload, successCallback) => {
    dispatch({
      type: actionsMO.SWAP_ODDS,
      payload,
      successCallback,
    })
  },
  ChangeOdds: (payload, successCallback) => {
    dispatch({
      type: actionsMO.CHANGE_ODDS,
      payload,
      successCallback,
    })
  },
})

const InputOdds = ({
  match_id,
  sub_match_id,
  odds,
  game_type,
  textOnly,
  successCallback,
  SwapOdds,
  ChangeOdds,
}) => {
  const oddsOnFav = odds <= 0 // minus: OnFav, plus: notOnFav
  const swapIcon = oddsOnFav ? <PlusOutlined /> : <MinusOutlined />
  const className = oddsOnFav ? '' : 'text-red'

  const popup_id = usePopupID()

  const inputRef = React.useRef(null)
  const [isFocus, setIsFocus] = React.useState(false)
  return (
    <Space.Compact>
      <button
        size="small"
        type="button"
        className="p-0 mo_btn"
        onClick={() =>
          SwapOdds(
            {
              match_id,
              sub_match_id,
              odds: parseFloat(odds) * -1,
              popup_id,
            },
            successCallback,
          )
        }
        disabled={textOnly}
      >
        {swapIcon}
      </button>
      <InputNumber
        ref={inputRef}
        onClick={() => inputRef.current.select()}
        variant={isFocus ? 'outlined' : 'filled'}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        controls={false}
        value={Math.abs(odds)}
        onPressEnter={e => {
          let newOdds = e.target.value
          if (oddsOnFav && newOdds >= 0) newOdds *= -1
          if (validateOdds(newOdds, game_type)) {
            ChangeOdds(
              {
                match_id,
                sub_match_id,
                odds: parseFloat(newOdds),
                popup_id,
              },
              successCallback,
            )
            inputRef.current.blur()
          }
        }}
        className={`${className} mo_input_number`}
        disabled={textOnly}
      />
    </Space.Compact>
  )
}
const validateOdds = (odds, gameType) => {
  const [isValid, errMsg] = isOddsValid(odds, gameType)
  if (!isValid) message.warning(errMsg)
  return isValid
}

export default connect(null, mapDispatchToProps)(InputOdds)
