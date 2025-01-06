import React from 'react'
import { connect } from 'react-redux'
import { Button, message, Select, Space } from 'antd'
import actionsMOScoringDetail from 'redux/mo-scoring-detail/actions'

const mapDispatchToProps = dispatch => ({
  EditMOScoringDetail: payload => {
    dispatch({
      type: actionsMOScoringDetail.OPEN_EDIT,
      payload,
    })
  },
})

const DropdownScoreRC = React.memo(({ tableRef, EditMOScoringDetail }) => {
  const getSelectedRow = () => {
    const { selectedRow } = tableRef.current
    if (!selectedRow) {
      message.warning('Please select 1 Record!')
      return false
    }
    return selectedRow
  }

  const onClickScoringDetail = () => {
    const selectedRow = getSelectedRow()
    if (selectedRow) EditMOScoringDetail(selectedRow.ArrMatch)
  }
  return (
    <Select
      style={{ width: 175 }}
      placeholder="Score (RC)"
      dropdownRender={() => (
        <Space className="p-1 w-100" direction="vertical">
          <Button className="w-100" type="text" size="small" onClick={onClickScoringDetail}>
            Scoring Detail
          </Button>
        </Space>
      )}
      size="small"
    />
  )
})

export default connect(null, mapDispatchToProps)(DropdownScoreRC)
