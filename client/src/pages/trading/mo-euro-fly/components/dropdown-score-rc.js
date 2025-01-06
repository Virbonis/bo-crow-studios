import React from 'react'
import { connect } from 'react-redux'
import { Button, message, Select, Space } from 'antd'
import actionsMOScoring from 'redux/mo-scoring/actions'

const mapDispatchToProps = dispatch => ({
  EditMOScoring: payload => {
    dispatch({
      type: actionsMOScoring.EDIT,
      payload,
    })
  },
})

const DropdownScoreRC = React.memo(({ tableRef, EditMOScoring }) => {
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

  return (
    <Select
      style={{ width: 175 }}
      placeholder="Score (RC)"
      dropdownRender={() => (
        <Space className="p-1 w-100" direction="vertical">
          <Button className="w-100" type="text" size="small" onClick={onClickFinalScore}>
            Final Score
          </Button>
        </Space>
      )}
      size="small"
    />
  )
})

export default connect(null, mapDispatchToProps)(DropdownScoreRC)
