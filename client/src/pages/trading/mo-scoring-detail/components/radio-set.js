import React from 'react'
import { connect } from 'react-redux'
import { Radio } from 'antd'
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

const RadioSet = ({ match_id, sport_id, UpdateScoreDetail, value, current_set, children }) => {
  const onChangeSet = () =>
    UpdateScoreDetail({
      match_id,
      sport_id,
      set: value,
      point: '',
      group: 'CurrentSet',
      home_away: '',
    })

  return (
    <Radio checked={current_set === value} onChange={onChangeSet}>
      {children}
    </Radio>
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(RadioSet)
