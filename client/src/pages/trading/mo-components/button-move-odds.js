import React from 'react'
import { isNumber } from 'lodash'
import { usePopupID } from 'components/blaise/custom/wrapperPopup'
import actionsMO from 'redux/mo5/actions'
import { connect } from 'react-redux'

const mapDispatchToProps = dispatch => ({
  MoveOdds: (payload, successCallback) => {
    dispatch({
      type: actionsMO.MOVE_ODDS,
      payload,
      successCallback,
    })
  },
})

const ButtonMoveOdds = ({
  match_id,
  sub_match_id,
  odds,
  direction,
  gt,
  display_admin,
  tableRef,
  MoveOdds,
  successCallback,
}) => {
  const popup_id = usePopupID()
  const className = odds < 0 ? 'text-red' : ''

  const moveOddsRefs = React.useMemo(() => {
    if (tableRef) {
      if (gt === 'HDP')
        return [
          tableRef.current.moveOddsHDP1Ref,
          tableRef.current.moveOddsHDP2Ref,
          tableRef.current.moveOddsHDP3Ref,
        ]
      if (gt === 'OU')
        return [
          tableRef.current.moveOddsOU1Ref,
          tableRef.current.moveOddsOU2Ref,
          tableRef.current.moveOddsOU3Ref,
        ]
      if (gt === 'GAH')
        return [
          tableRef.current.moveOddsOU1Ref,
          tableRef.current.moveOddsOU2Ref,
          tableRef.current.moveOddsOU3Ref,
        ]
      if (gt === 'OE') return [tableRef.current.moveOddsOERef]
      return []
    }
    return []
  }, [tableRef, gt])

  const onClickMoveOdds = React.useCallback(() => {
    const { data, viewParameter } = tableRef?.current || {}
    if (viewParameter.move_3_market) {
      const sameSubMatch = data.filter(
        x =>
          x.ArrMatch.match_id === match_id &&
          x.ArrMatch.display_admin.toString().length === display_admin.toString().length,
      )
      sameSubMatch.forEach(m => {
        if (gt === 'HDP')
          MoveOddsCore(m.ArrMatch.match_id, m.ArrHDP.sub_match_id, m.ArrMatch.display_admin)
        else if (gt === 'OU')
          MoveOddsCore(m.ArrMatch.match_id, m.ArrOU.sub_match_id, m.ArrMatch.display_admin)
        else if (gt === 'GAH')
          MoveOddsCore(m.ArrMatch.match_id, m.ArrGAH.sub_match_id, m.ArrMatch.display_admin)
        else if (gt === 'OE')
          MoveOddsCore(m.ArrMatch.match_id, m.ArrOE.sub_match_id, m.ArrMatch.display_admin)
      })
    } else {
      MoveOddsCore(match_id, sub_match_id, display_admin)
    }

    function MoveOddsCore(mid, smid, da) {
      let point = 1
      if (isNumber(da)) {
        let moveRef = da % 30
        // if (moveRef > 3) moveRef = 3
        if (moveRef > moveOddsRefs.length) moveRef = moveOddsRefs.length
        point = moveOddsRefs[moveRef - 1].current?.value || 1 // default 1 if null
      }
      if (direction === 'H-NG' || direction === 'A-NG') point = 1

      if (point > 0) {
        // move odds
        MoveOdds(
          {
            match_id: mid,
            sub_match_id: smid,
            direction,
            point,
            popup_id,
          },
          successCallback,
        )
      }
    }
  }, [
    match_id,
    sub_match_id,
    direction,
    gt,
    display_admin,
    popup_id,
    moveOddsRefs,
    tableRef,
    successCallback,
    MoveOdds,
  ])

  return (
    <button
      size="small"
      type="button"
      className={`${className} p-0 w-100 mo_btn_odds`}
      onClick={onClickMoveOdds}
    >
      {odds}
    </button>
  )
}

/**
 * @param {int} match_id
 * @param {int} sub_match_id
 * @param {decimal} odds
 * @param {string} direction
 * @param {string} gt
 * @param {int} display_admin - reference for move_3_market, leave it null if not use
 * @param {React.ref} tableRef - reference for move_3_market, leave it null if not use
 * @param {function} successCallback
 */
export default connect(null, mapDispatchToProps)(ButtonMoveOdds)
