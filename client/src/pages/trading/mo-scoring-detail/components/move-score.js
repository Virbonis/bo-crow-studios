import React from 'react'
import { connect } from 'react-redux'
import { Button, Space } from 'antd'
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

const MoveScore = ({ match_id, sport_id, UpdateScoreDetail, row, current_set, movePoint = 1 }) => {
  const onClickMoveScore = value =>
    UpdateScoreDetail({
      match_id,
      sport_id,
      set: current_set,
      point: (row[`set${current_set}`] + value).toString(), // currentset point +/- 1
      group: 'Set',
      home_away: row.set_name, // H/A
    })

  return (
    <Space direction="vertical" size={0}>
      <Button
        className="w-100 bg-green text-white"
        type="text"
        size="small"
        onClick={() => onClickMoveScore(1 * movePoint)}
      >
        +{1 * movePoint}
      </Button>
      <Button
        className="w-100 bg-red text-white"
        type="text"
        size="small"
        onClick={() => onClickMoveScore(-1 * movePoint)}
      >
        -{1 * movePoint}
      </Button>
    </Space>
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(MoveScore)
