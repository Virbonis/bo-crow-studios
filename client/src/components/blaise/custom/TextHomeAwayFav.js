import React from 'react'
import { getShortBetChoice } from 'helper/bet-choice'
import { listGT } from 'helper'

export const TextHomeFav = ({ st_fav, game_type, bet_choice, home_name, neutral_ground }) => {
  st_fav = parseInt(st_fav, 10)
  const shortBetChoice = getShortBetChoice(bet_choice)
  let suffixText = ''
  let homeClassName = ''
  if (neutral_ground) {
    suffixText = neutral_ground === 'Y' ? ' (N)' : ''
  }
  if (listGT.Handicap.includes(game_type)) {
    if (st_fav === -1) homeClassName = 'text-red'
    if (shortBetChoice === 'H') homeClassName += ' text-bold'
  } else if (listGT.OverUnder.includes(game_type) && shortBetChoice === 'O')
    homeClassName = 'text-blue text-bold'
  else if (listGT.OddEven.includes(game_type) && shortBetChoice === 'O')
    homeClassName = 'text-green text-bold'
  else if (listGT.MoneyLine.includes(game_type) && shortBetChoice === 'H')
    homeClassName = 'font-weight-bold'

  return (
    <span title={`${home_name}${suffixText}`} className={homeClassName}>
      {home_name}
      {suffixText}
    </span>
  )
}
export const TextAwayFav = ({ st_fav, game_type, bet_choice, away_name }) => {
  st_fav = parseInt(st_fav, 10)
  const shortBetChoice = getShortBetChoice(bet_choice)

  let awayClassName = ''
  if (listGT.Handicap.includes(game_type)) {
    if (st_fav === 1) awayClassName = 'text-red'
    if (shortBetChoice === 'A') awayClassName += ' font-weight-bold'
  } else if (listGT.OverUnder.includes(game_type) && shortBetChoice === 'U')
    awayClassName = 'font-weight-bold text-blue'
  else if (listGT.OddEven.includes(game_type) && shortBetChoice === 'E')
    awayClassName = 'font-weight-bold text-green'
  else if (listGT.MoneyLine.includes(game_type) && shortBetChoice === 'A')
    awayClassName = 'font-weight-bold'

  return (
    <span title={`${away_name}`} className={awayClassName}>
      {away_name}
    </span>
  )
}

export default TextHomeFav
