import React from 'react'
import { connect } from 'react-redux'
import { Button, Modal } from 'antd'
import actions from 'redux/mo5/actions'
// import actionsMOOGT from 'redux/mo-other-game-type/actions'

const mapDispatchToProps = dispatch => ({
  UpdatePauseResumeAll: (payload, successCallback) => {
    dispatch({
      type: actions.PAUSE_RESUME_ALL,
      payload,
      successCallback,
    })
  },
  // UpdateOGTPauseResumeAll: (payload, successCallback) => {
  //   dispatch({
  //     type: actionsMOOGT.UPDATE_MORE_STATUS_PAUSE_ALL,
  //     payload,
  //     successCallback,
  //   })
  // },
})

const ButtonPauseAll = React.memo(
  ({
    UpdatePauseResumeAll,
    // UpdateOGTPauseResumeAll,
    mo_page = 'MOAHOU',
    popup_id,
    match_time_slot,
    successCallback,
    // tableRef,
  }) => {
    const [status, setStatus] = React.useState(false)
    const title = status ? 'Resume All' : 'Pause All'

    const onClickPauseAll = () => {
      Modal.confirm({
        title: `Are you sure to ${title} matches in your screen ?`,
        content: '',
        okText: 'Yes',
        cancelText: 'No',
        onOk: () => {
          UpdatePauseResumeAll(
            {
              match_pause_status: status ? 0 : 3,
              popup_id,
              match_time_slot,
              mo_page,
            },
            () => {
              setStatus(curr => !curr)
              successCallback()
            },
          )

          // // Pause/Resume all OGT
          // const { data } = tableRef.current
          // const uniqMatchIDs = data.reduce((acc, curr) => {
          //   const { ArrMatch } = curr
          //   if (!acc.includes(ArrMatch.match_id)) acc.push(ArrMatch.match_id)
          //   return acc
          // }, [])
          // uniqMatchIDs.forEach(match_id =>
          //   UpdateOGTPauseResumeAll({
          //     match_id,
          //     status: status ? 0 : 3,
          //   }),
          // )
        },
      })
    }

    return (
      <Button
        size="small"
        type="primary"
        onClick={onClickPauseAll}
        className="font-weight-bold bg-dark"
      >
        {title}
      </Button>
    )
  },
)

export default connect(null, mapDispatchToProps)(ButtonPauseAll)
