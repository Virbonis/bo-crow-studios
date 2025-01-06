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

const RadioBallPosition = ({
  match_id,
  sport_id,
  UpdateScoreDetail,
  ball_position,
  set_name,
  ball,
  children,
}) => {
  const onChangeBallPos = () =>
    UpdateScoreDetail({
      match_id,
      sport_id,
      set: 0,
      point: set_name === 'H' ? '1' : '2',
      group: 'BallPosition',
      home_away: '',
    })

  return (
    <Radio checked={ball_position === ball} onChange={onChangeBallPos}>
      {children}
    </Radio>
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(RadioBallPosition)
