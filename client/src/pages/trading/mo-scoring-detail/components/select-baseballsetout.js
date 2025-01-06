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

const SelectBaseballSetOut = ({ match_id, sport_id, UpdateScoreDetail, value }) => {
  const onChangeSet = v => {
    UpdateScoreDetail({
      match_id,
      sport_id,
      set: 0,
      point: v,
      group: 'StOutBaseBall',
      home_away: 'H', // H/A
    })
  }
  return (
    <Select
      value={value}
      onChange={onChangeSet}
      options={[
        { value: '0', label: '0' },
        { value: '1', label: '1' },
        { value: '2', label: '2' },
      ]}
    />
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(SelectBaseballSetOut)
