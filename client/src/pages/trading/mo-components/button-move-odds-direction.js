import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import actions from 'redux/mo5/actions'

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  MoveOdds: payload => {
    dispatch({
      type: actions.MOVE_ODDS,
      payload,
      successCallback,
    })
  },
})

const ButtonMoveOddsDirection = React.memo(
  ({ MoveOdds, match_id, sub_match_id, direction, gt, tableRef, enabled }) => {
    if (!enabled) return direction

    const moveOddsRefs = React.useMemo(() => {
      if (tableRef) {
        if (gt === 'HDP') return tableRef.current.moveOddsHDPRef
        if (gt === 'OU') return tableRef.current.moveOddsOURef
        if (gt === 'OE') return tableRef.current.moveOddsOERef
      }
      return null
    }, [tableRef, gt])

    const onClickMoveOdds = () => {
      const point = moveOddsRefs?.current?.value || 1 // default 1 if null
      const { popup_id } = tableRef.current.viewParameter
      if (point > 0) {
        MoveOdds({
          match_id,
          sub_match_id,
          direction,
          point,
          popup_id,
        })
      }
    }
    return (
      <Button size="small" className="p-0 w-100" onClick={onClickMoveOdds}>
        {direction}
      </Button>
    )
  },
)

export default connect(null, mapDispatchToProps)(ButtonMoveOddsDirection)
