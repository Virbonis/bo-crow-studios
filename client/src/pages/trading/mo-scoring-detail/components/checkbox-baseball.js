import React from 'react'
import { connect } from 'react-redux'
import { Checkbox } from 'antd'
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

const CheckboxBaseball = ({ match_id, sport_id, UpdateScoreDetail, value, no }) => {
  const onChangeSet = e => {
    UpdateScoreDetail({
      match_id,
      sport_id,
      set: 0,
      point: e.target.checked ? '1' : '0',
      group: `StBase${no}BaseBall`,
      home_away: 'H', // H/A
    })
  }
  return (
    <Checkbox checked={value === 1} onChange={onChangeSet}>
      Yes
    </Checkbox>
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(CheckboxBaseball)
