import React from 'react'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'
import actions from 'redux/mo-scoring-detail/actions'
import { DragableModal } from 'components/blaise'
import Content from './content'

const mapStateToProps = ({ moScoringDetail }) => ({
  editValue: moScoringDetail.editValue,
  visible: !isEmpty(moScoringDetail.editValue),
  viewParameter: moScoringDetail.viewParameter,
})
const mapDispatchToProps = dispatch => ({
  CancelEdit: () => dispatch({ type: actions.CLEAN_UP }),
  setViewParameter: payload => {
    dispatch({
      type: actions.SET_VIEW_PARAMETER,
      payload,
    })
  },
  UpdateScoreDetail: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_SCORE_DETAIL,
      payload,
      successCallback,
    })
  },
})

const DrawerMOScoringDetail = React.memo(
  ({ editValue, visible, viewParameter, setViewParameter, CancelEdit, UpdateScoreDetail }) => {
    if (!visible) return null

    const { match_id, home_name, away_name } = editValue
    return (
      <DragableModal
        title={`Scoring Detail - ${match_id} - ${home_name} - ${away_name}`}
        open={visible}
        onCancel={CancelEdit}
        footer={null}
        width={800}
      >
        <Content
          editValue={editValue}
          viewParameter={viewParameter}
          setViewParameter={setViewParameter}
          UpdateScoreDetail={UpdateScoreDetail}
        />
      </DragableModal>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(DrawerMOScoringDetail)
