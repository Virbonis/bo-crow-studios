import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/instant-bet/actions'
import { getGameTypeDescriptionShort } from 'helper'

const mapDispatchToProps = dispatch => ({
  OpenInstantBetDetail: payload => {
    dispatch({
      type: actions.OPEN_INSTANT_BET_DETAIL,
      payload,
    })
  },
})
// GameTypeColumn (instantbet, mo-acrj)
export const GameTypeColumn = connect(
  null,
  mapDispatchToProps,
)(
  ({
    game_type,
    parlay_seq,
    bet_id,
    is_parlay_live,
    parlay_combo_ticket,
    OpenInstantBetDetail,
    game_type_name_bti,
    // choice_name_bti,
  }) => {
    if (game_type_name_bti) return <span title={game_type_name_bti}>BTI</span>

    const openInstantBetParlay = () => OpenInstantBetDetail({ view: 'parlay', parlay_seq, bet_id })
    const openInstantBetMatchParlay = () => OpenInstantBetDetail({ view: 'match_parlay', parlay_seq, bet_id }) // prettier-ignore
    const openInstantBetLottery = () => OpenInstantBetDetail({ view: 'lottery', bet_id })

    const result = getGameTypeDescriptionShort(game_type)
    if (is_parlay_live === 1 && parlay_combo_ticket === 1) return <>PAR {result}</>
    if (is_parlay_live === 1 && parlay_combo_ticket > 1) return <>COM {result}</>

    if (game_type === -1)
      return (
        <button
          size="small"
          type="button"
          onClick={openInstantBetParlay}
          className="p-0 btn btn-link"
        >
          {parlay_combo_ticket > 1 ? 'COM ' : 'PAR'}
        </button>
      )
    if (game_type === 3000)
      return (
        <button
          size="small"
          type="button"
          onClick={openInstantBetMatchParlay}
          className="p-0 btn btn-link"
        >
          {result}
        </button>
      )
    if (game_type === 4000)
      return (
        <button
          size="small"
          type="button"
          onClick={openInstantBetLottery}
          className="p-0 btn btn-link"
        >
          {result}
        </button>
      )
    return result
  },
)
export default GameTypeColumn
