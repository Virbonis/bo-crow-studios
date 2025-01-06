import React from 'react'
import { connect } from 'react-redux'
import { Select } from 'antd'
import actions from 'redux/mo-scoring-detail/actions'

const mapStateToProps = ({ moScoringDetail }) => ({
  match_id: moScoringDetail.editValue.match_id,
  sport_id: moScoringDetail.editValue.sport_id,
})

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  UpdateScoreDetail: payload => {
    dispatch({
      type: actions.UPDATE_SCORE_DETAIL,
      payload,
      successCallback,
    })
  },
})

const SelectSet = ({ match_id, sport_id, UpdateScoreDetail, row }) => {
  const { set, set_name } = row
  const onChangeSet = value =>
    UpdateScoreDetail({
      match_id,
      sport_id,
      set: 7,
      point: value.toString(),
      group: 'Set',
      home_away: set_name, // H/A
    })

  return (
    <Select
      value={set}
      onChange={onChangeSet}
      options={[
        { value: 0, label: '0' },
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
      ]}
    />
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(SelectSet)
