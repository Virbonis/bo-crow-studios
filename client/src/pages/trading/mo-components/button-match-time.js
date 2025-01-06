import { Button, message } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/match-time/actions'

const mapDispatchToProps = dispatch => ({
  EditMatchTime: payload => {
    dispatch({
      type: actions.EDIT,
      payload,
    })
  },
})

const ButtonMatchTime = ({ tableRef, EditMatchTime }) => {
  const onClickMatchTime = () => {
    const { selectedRow } = tableRef.current
    if (!selectedRow) {
      message.warning('Please select 1 Record!')
      return
    }

    const { ArrMatch } = selectedRow
    EditMatchTime({
      match_id: ArrMatch.match_id,
      sport_id: ArrMatch.sport_id,
      match_round: ArrMatch.match_round,
      match_elapsed: ArrMatch.match_elapsed,
      st_injury_ht: ArrMatch.st_injury_ht,
      st_injury_ft: ArrMatch.st_injury_ft,
      injury_ht: ArrMatch.injury_ht,
      injury_ft: ArrMatch.injury_ft,
    })
  }

  return (
    <>
      <Button
        size="small"
        type="primary"
        onClick={onClickMatchTime}
        className="font-weight-bold bg-dark"
      >
        Match Time
      </Button>
    </>
  )
}

export default connect(null, mapDispatchToProps)(ButtonMatchTime)
