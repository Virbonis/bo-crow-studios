import React from 'react'
import listGT, { gameTypeDescription } from 'helper/game-type'
import { getBetChoice } from 'helper/bet-choice'
import { Amount, amount, getBetScore } from 'components/blaise'
import { Space } from 'antd'

export const BetSlipWLDescription = React.memo(record => {
  const {
    league_name,
    home_name,
    away_name,
    bet_choice,
    game_type,
    first_goal,
    last_goal,
    handicap,
    m_game_type,
    m_odds,
    sport_name,
    bet_builder_market,

    game_type_name_bti,
    choice_name_bti,
  } = record
  // Lottery
  if (game_type === 4000) return 'Lottery'

  const SPORTLEAGUE = () => (
    <>
      <span className="text-green">({sport_name})</span> {league_name}
    </>
  )
  // Match Parlay(betbuilder)
  if ([77, 3000].includes(game_type)) {
    const splitString = bet_builder_market?.split(' And ')
    return (
      <Space direction="vertical" size={0}>
        <span className="text-blue font-weight-bold">{gameTypeDescription[game_type]?.long}</span>
        <SPORTLEAGUE />
        {`${home_name} vs ${away_name}`}
        {splitString}
      </Space>
    )
  }
  // Outright
  if (game_type === 11) {
    return (
      <>
        <span className="text-red font-weight-bold">{home_name}</span>
        <br />
        <span className="text-blue font-weight-bold">{gameTypeDescription[game_type]?.long}</span>
        <br />
        <SPORTLEAGUE />
      </>
    )
  }

  const BET = () => {
    let choice
    if (choice_name_bti) choice = choice_name_bti
    else choice = getBetChoice(bet_choice, home_name || '', away_name || '')

    let CHOICE_ONLY = <span className="font-weight-bold text-red">{choice}</span>
    let result = CHOICE_ONLY

    if (listGT.Handicap.includes(m_game_type) || listGT.OverUnder.includes(m_game_type)) {
      // replace with black, if AH, handicap on away >= 0
      if (listGT.Handicap.includes(m_game_type) && handicap >= 0)
        CHOICE_ONLY = <span className="font-weight-bold text-black">{choice}</span>
      const HANDICAP = <Amount className="font-weight-bold text-black" value={handicap} />
      result = (
        <>
          {CHOICE_ONLY} {HANDICAP}
        </>
      )
    }

    const BETSCORE = <span className="text-blue">{getBetScore(record, true)}</span>
    result = (
      <>
        {BETSCORE} {result}
      </>
    )

    // mixparlay
    if (game_type === -1) {
      const ODDS = <span className="text-red"> @ {amount(m_odds, 3)}</span>
      return (
        <>
          {result} {ODDS}
        </>
      )
    }
    return result
  }
  const GAMETYPE = () => {
    let gameTypeText = gameTypeDescription[m_game_type]?.long
    if (game_type_name_bti) gameTypeText = game_type_name_bti

    return <span className="text-blue font-weight-bold">{gameTypeText}</span>
  }
  const MATCH = () => {
    const VS = <span className="text-blue"> vs </span>

    if (game_type === 14) {
      let FG = ''
      let LG = ''
      switch (first_goal) {
        case -1:
          FG = 'INSERT IMAGE' // Home
          break
        case 1:
          FG = 'INSERT IMAGE' // Away
          break
        default:
          FG = ''
          break
      }
      switch (last_goal) {
        case -1:
          LG = 'INSERT IMAGE' // Home
          break
        case 1:
          LG = 'INSERT IMAGE' // Away
          break
        default:
          LG = ''
          break
      }
      return (
        <Space size={1}>
          {home_name} <div className={`${FG}`} /> {VS} {away_name} <div className={`${LG}`} />
        </Space>
      )
    }
    return (
      <span>
        {home_name} {VS} {away_name}
      </span>
    )
  }

  return (
    <Space direction="vertical" size={0}>
      <BET />
      <GAMETYPE />
      <MATCH />
      <SPORTLEAGUE />
    </Space>
  )
})

export default BetSlipWLDescription
