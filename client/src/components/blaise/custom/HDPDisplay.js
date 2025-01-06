import React from 'react'
import { getBetChoice, getShortBetChoice, listGT } from 'helper'
import { Amount } from './Amount'

export const HDPColumn = record => {
  const { choice_name_bti, handicap, bet_choice, home_name, away_name, game_type } = record

  let title
  let resultText
  if (choice_name_bti) {
    title = choice_name_bti
    // if handicap not 0, show handicap and format handicap max 2 digit after comma
    const handicapBTI = <Amount value={handicap} noColor />
    resultText = handicap !== 0 ? handicapBTI : '...'
  } else {
    title = getBetChoice(bet_choice, home_name, away_name)
    // if handicap/ou show handicap, if not show bet choice
    if (listGT.Handicap.includes(game_type) || listGT.OverUnder.includes(game_type))
      resultText = HDPDisplay(record)
    else resultText = getShortBetChoice(bet_choice)
  }

  return <span title={title}>{resultText}</span>
}
const HDPDisplay = record => {
  const { handicap, bet_choice, bet_fav_status } = record

  const shortBetChoice = getShortBetChoice(bet_choice)
  let className = 'text-reset'
  if (
    (shortBetChoice === 'H' && bet_fav_status === -1) ||
    (shortBetChoice === 'A' && bet_fav_status === 1) ||
    shortBetChoice === 'O'
  ) {
    className = 'text-red'
  } else if (
    (shortBetChoice === 'H' && bet_fav_status === 1) ||
    (shortBetChoice === 'A' && bet_fav_status === -1) ||
    shortBetChoice === 'U'
  ) {
    className = 'text-blue'
  }

  const handicapDisplay = getHDCDisplay(handicap)
  return <span className={className}>{handicapDisplay}</span>
}

export const getHDCDisplay = handicap => {
  handicap = Math.abs(handicap)
  const p0 = Math.floor(handicap)
  const p1 = handicap - p0

  if (handicap === 0) return '0'
  if (p1 === 0.125) return `${p0}/${p0 + p1 + 0.125}`
  if (p1 === 0.25) return `${p0}/${p0 + p1 + 0.25}`
  if (p1 === 0.75) return `${p0 + p1 - 0.25}/${p0 + p1 + 0.25}`
  if (p1 === 0.5) return `${p0 + p1}`
  return `${handicap}`
}
export const getHDCDisplay3WH = (betChoice, handicap) => {
  if (betChoice === '3WHH') {
    const temp = handicap >= 0 ? '+' : ''
    return `(${temp}${handicap})`
  }
  if (betChoice === '3WHD') {
    const temp = handicap >= 0 ? 'H' : 'A'
    return `(${temp}+${Math.abs(handicap)})`
  }
  if (betChoice === '3WHA') {
    const temp = handicap * -1 >= 0 ? '+' : ''
    return `(${temp}${handicap * -1})`
  }
  return null
}

export default HDPDisplay
