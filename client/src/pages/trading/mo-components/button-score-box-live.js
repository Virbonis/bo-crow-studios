import React from 'react'
import { connect } from 'react-redux'
import actionsMO from 'redux/mo5/actions'
import actionsMatchRecord from 'redux/match-record/actions'

const mapDispatchToProps = dispatch => ({
  EditMatchRecord: payload => {
    dispatch({
      type: actionsMatchRecord.EDIT,
      payload,
    })
  },
  UpdateZeroOdds: (payload, successCallback) => {
    dispatch({
      type: actionsMO.UPDATE_ZERO_ODDS,
      payload,
      successCallback,
    })
  },
})

const ButtonScoreBoxLive = ({
  st_live,
  home_posisi,
  away_posisi,
  elapsed_live,
  scoreBoxClass,
  // params eventclick
  match_id,
  home_rc,
  away_rc,
  home_yc,
  away_yc,
  st_penalty,
  textOnly,
  EditMatchRecord,
  UpdateZeroOdds,
  successCallback,
}) => {
  if (st_live === 'N') return null

  const scoreBoxText = st_live === 'Y' ? `${home_posisi}-${away_posisi}` : ''
  const elapsedLive = st_live === 'Y' ? elapsed_live : ''

  const highlightTextClass =
    elapsed_live.toLowerCase().includes('live') || elapsed_live.toLowerCase().includes('ht')
      ? 'text-red text-uppercase text-bold'
      : ''

  if (textOnly)
    return (
      scoreBoxText && (
        <>
          <div className={`score_box ${scoreBoxClass} m-0 p-0`}>{scoreBoxText}</div>
          <div className={highlightTextClass}>{elapsedLive}</div>
        </>
      )
    )

  const onClickLive = () => {
    EditMatchRecord({
      match_id,
      home_posisi,
      away_posisi,
      home_rc,
      away_rc,
      home_yc,
      away_yc,
      st_penalty,
    })
    UpdateZeroOdds({ match_id }, successCallback)
  }
  return (
    <>
      <button
        size="small"
        type="button"
        className={`score_box ${scoreBoxClass} m-0 py-2`}
        onClick={onClickLive}
      >
        {scoreBoxText}
      </button>
      <div className={highlightTextClass}>{elapsedLive}</div>
    </>
  )
}

export default connect(null, mapDispatchToProps)(ButtonScoreBoxLive)
