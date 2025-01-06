import React from 'react'
import { connect } from 'react-redux'
import { Select } from 'antd'
import actions from 'redux/mo5/actions'

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  ChangeHandicap: payload => {
    dispatch({
      type: actions.CHANGE_HANDICAP,
      payload,
      successCallback,
    })
  },
})

const generateHDCNumber = until => {
  const options = []
  for (let i = 0; i < until; i += 0.25) {
    options.push({ value: i, label: i })
  }
  return options
}

export const optionsHDPNumber = generateHDCNumber(100)
export const optionsOUNumber = generateHDCNumber(600)

const SelectHandicapNumber = ({ gt, match_id, sub_match_id, handicap, ChangeHandicap }) => {
  const onChange = value => {
    ChangeHandicap({
      match_id,
      sub_match_id,
      handicap: value,
    })
  }
  return (
    <Select
      value={handicap}
      onChange={onChange}
      size="small"
      className="w-100"
      suffixIcon={null}
      options={gt === 'HDP' ? optionsHDPNumber : optionsOUNumber}
    />
  )
}

export default connect(null, mapDispatchToProps)(SelectHandicapNumber)
