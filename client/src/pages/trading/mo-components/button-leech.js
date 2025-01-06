import React from 'react'
import { Button, message, Modal } from 'antd'
import actions from 'redux/mo5/actions'
import { connect } from 'react-redux'
import { uniq } from 'lodash'

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  UpdateLeechAssign: payload => {
    dispatch({
      type: actions.UPDATE_LEECH_ASSIGN,
      payload,
      successCallback,
    })
  },
})

const ButtonLeech = React.memo(({ tableRef, UpdateLeechAssign }) => {
  const onClickLeech = status => () => {
    let matchIDs = []
    if (tableRef.current.page === 'MO5') {
      const { hiddenRows } = tableRef.current
      if (hiddenRows.length === 0) {
        message.warning('Please select 1 Record!')
        return
      }
      matchIDs = uniq(
        hiddenRows.map(x => {
          return parseInt(x.split('-')[0], 10) // match_id
        }),
      )
    } else {
      const { selectedRow } = tableRef.current
      if (!selectedRow) {
        message.warning('Please select 1 Record!')
        return
      }
      matchIDs = [selectedRow.ArrMatch.match_id]
    }

    const title = status === 2 ? 'Are you sure to Leech IBC?' : 'Are you sure to OFF Leech IBC?'
    Modal.confirm({
      title,
      content: '',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {
        matchIDs.forEach(v => {
          UpdateLeechAssign({ match_id: v, status })
        })
      },
    })
  }

  return (
    <>
      <Button
        size="small"
        type="primary"
        className="font-weight-bold bg-dark"
        onClick={onClickLeech(2)}
      >
        ON
      </Button>
      <Button
        size="small"
        type="primary"
        className="font-weight-bold bg-dark"
        onClick={onClickLeech(0)}
      >
        OFF
      </Button>
    </>
  )
})

export default connect(null, mapDispatchToProps)(ButtonLeech)
