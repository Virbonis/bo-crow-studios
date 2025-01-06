import React from 'react'
import { connect } from 'react-redux'
import { Typography } from 'antd'
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
const ButtonMoveOddsSingle = React.memo(
  ({ MoveOdds, match_id, sub_match_id, odds, direction, gt, tableRef, enabled = true }) => {
    if (!enabled) return <Typography.Text className="w-100">{odds}</Typography.Text>

    const className = odds < 0 ? 'text-red' : ''
    const moveOddsRefs = React.useMemo(() => {
      if (tableRef) {
        if (gt === 'HDP') return tableRef.current.moveOddsHDPRef
        if (gt === 'OU') return tableRef.current.moveOddsOURef
        if (gt === 'OE') return tableRef.current.moveOddsOERef
        if (gt === 'ML') return tableRef.current.moveOddsMLRef
      }
      return null
    }, [tableRef, gt])

    const onClickMoveOdds = () => {
      const point = moveOddsRefs?.current?.value || 1 // default 1 if null
      // const { popup_id } = tableRef.current.viewParameter
      if (point > 0) {
        MoveOdds({
          match_id,
          sub_match_id,
          direction,
          point,
          // popup_id,
        })
      }
    }
    return (
      <button
        size="small"
        type="button"
        className={`${className} w-100 mo_btn_odds font-weight-bold`}
        onClick={onClickMoveOdds}
      >
        {odds}
      </button>
    )
  },
)

/**
 * @param {int} match_id
 * @param {int} sub_match_id
 * @param {decimal} odds
 * @param {string} direction
 * @param {string} gt
 * @param {React.ref} tableRef
 * @param {function} successCallback
 */
export default connect(null, mapDispatchToProps)(ButtonMoveOddsSingle)
