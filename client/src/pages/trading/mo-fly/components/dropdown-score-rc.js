import React from 'react'
import { connect } from 'react-redux'
import { Button, message, Select, Space } from 'antd'
import actionsMOScoring from 'redux/mo-scoring/actions'
import actionsMOScoringDetail from 'redux/mo-scoring-detail/actions'
import actionsEarlySettlement from 'redux/early-settlement/actions'

const mapDispatchToProps = dispatch => ({
  EditMOScoring: payload => {
    dispatch({
      type: actionsMOScoring.EDIT,
      payload,
    })
  },
  EditMOScoringDetail: payload => {
    dispatch({
      type: actionsMOScoringDetail.OPEN_EDIT,
      payload,
    })
  },
  EditEarlySettlement: payload => {
    dispatch({
      type: actionsEarlySettlement.EDIT,
      payload,
    })
  },
})

const DropdownScoreRC = ({ tableRef, EditMOScoring, EditMOScoringDetail, EditEarlySettlement }) => {
  const getSelectedRow = () => {
    const { selectedRow } = tableRef.current
    if (!selectedRow) {
      message.warning('Please select 1 Record!')
      return false
    }
    return selectedRow
  }

  const onClickFinalScore = () => {
    const selectedRow = getSelectedRow()
    if (selectedRow) EditMOScoring(selectedRow.ArrMatch)
  }
  const onClickScoringDetail = () => {
    const selectedRow = getSelectedRow()
    if (selectedRow) EditMOScoringDetail(selectedRow.ArrMatch)
  }
  const onClickEarlySettlement = () => {
    const selectedRow = getSelectedRow()
    if (selectedRow) {
      if (selectedRow.ArrMatch.sport_id === 10) EditEarlySettlement(selectedRow.ArrMatch)
      else message.warning('Soccer Only')
    }
  }
  return (
    <Select
      style={{ width: 175 }}
      placeholder="Score (RC)"
      dropdownRender={() => (
        <Space className="p-1 w-100" direction="vertical">
          <Button className="w-100" type="text" size="small" onClick={onClickFinalScore}>
            Final Score
          </Button>
          <Button className="w-100" type="text" size="small" onClick={onClickScoringDetail}>
            Scoring Detail
          </Button>
          <Button className="w-100" type="text" size="small" onClick={onClickEarlySettlement}>
            Early Settlement
          </Button>
        </Space>
      )}
      size="small"
    />
  )
}

export default connect(null, mapDispatchToProps)(DropdownScoreRC)
