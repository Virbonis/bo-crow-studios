import { InputNumber } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import actionsMO from 'redux/mo5/actions'

const mapDispatchToProps = dispatch => ({
  ChangeLOD: (payload, successCallback) => {
    dispatch({
      type: actionsMO.CHANGE_LOD,
      payload,
      successCallback,
    })
  },
})

const InputLOD = ({ match_id, sub_match_id, link_odds_diff, ChangeLOD, successCallback }) => {
  const className = link_odds_diff < 0 ? 'text-red' : ''

  const inputRef = React.useRef()
  const [isFocus, setIsFocus] = React.useState(false)
  return (
    <InputNumber
      ref={inputRef}
      onClick={() => inputRef.current.select()}
      variant={isFocus ? 'outlined' : 'filled'}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      controls={false}
      value={link_odds_diff}
      onPressEnter={e => {
        const newLODValue = parseInt(e.target.value, 0)
        ChangeLOD(
          {
            match_id,
            sub_match_id,
            lod: newLODValue,
          },
          successCallback,
        )
      }}
      className={`${className} mo_input_number`}
    />
  )
}
export default connect(null, mapDispatchToProps)(InputLOD)
