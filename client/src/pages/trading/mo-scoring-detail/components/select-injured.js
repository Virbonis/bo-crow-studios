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

const SelectInjured = ({ match_id, sport_id, UpdateScoreDetail, st_injured }) => {
  const onChangeInjured = value => {
    UpdateScoreDetail({
      match_id,
      sport_id,
      set: 0,
      point: value,
      group: 'Injured',
      home_away: '',
    })
  }
  return (
    <Select
      value={st_injured}
      onChange={onChangeInjured}
      options={[
        { value: '', label: '' },
        { value: 'H', label: 'H' },
        { value: 'A', label: 'A' },
      ]}
    />
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(SelectInjured)
