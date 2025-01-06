import React from 'react'
import { connect } from 'react-redux'
import { message, Select } from 'antd'
import actions from 'redux/match-time/actions'
import { getRoundOptions } from 'helper'

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  EditMatchTime: payload => {
    dispatch({
      type: actions.EDIT,
      payload,
    })
  },
  UpdateMatchTime: payload => {
    dispatch({
      type: actions.UPDATE_MATCH_TIME,
      payload,
      successCallback,
    })
  },
})

const SelectMatchRound = ({ tableRef, UpdateMatchTime }) => {
  const [options, setOptions] = React.useState([])

  const onVisibleRound = isOpen => {
    if (!isOpen) setOptions([])
    else {
      const { selectedRow } = tableRef.current
      if (!selectedRow) {
        message.warning('Please select 1 Record!')
        return
      }

      const { ArrMatch } = selectedRow
      const { sport_id } = ArrMatch
      setOptions(getRoundOptions(sport_id))
    }
  }

  const onSelectRound = value => {
    const { selectedRow } = tableRef.current
    const { ArrMatch } = selectedRow
    const { match_id, sport_id } = ArrMatch
    if (sport_id === 10 && value > 10) {
      message.warning('Invalid Match Round')
      return
    }

    UpdateMatchTime({
      match_id,
      match_round: value,
      minutes: 0,
      st_injury_ht: '',
      st_injury_ft: '',
      injury_ht: 0,
      injury_ft: 0,
    })
  }

  return (
    <Select
      size="small"
      placeholder="Select Match Round"
      options={options}
      value={null}
      onDropdownVisibleChange={onVisibleRound}
      onSelect={onSelectRound}
      className="font-weight-bold bg-dark"
    />
  )
}
export default connect(null, mapDispatchToProps)(SelectMatchRound)
