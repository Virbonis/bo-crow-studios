import React from 'react'
import { Select } from 'antd'
import { connect } from 'react-redux'
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

const SelectPlayer = React.memo(({ match_id, sport_id, UpdateScoreDetail, player, set_name }) => {
  const onChangeSet = value => {
    UpdateScoreDetail({
      match_id,
      sport_id,
      set: 0,
      point: value,
      group: 'Player',
      home_away: set_name, // H/A
    })
  }
  return (
    <Select
      value={player}
      onChange={onChangeSet}
      options={[
        { value: '0', label: '0' },
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' },
      ]}
    />
  )
})
export default connect(mapStateToProps, mapDispatchToProps)(SelectPlayer)
