import React from 'react'
import { Space, Typography } from 'antd'
import { gameTypeDescription, getBetChoice, listGT } from 'helper'
import { amount } from './Amount'
import { getHDCDisplay, getHDCDisplay3WH } from './HDPDisplay'

const { Text } = Typography
export const BetSlip = React.memo(record => {
  const {
    game_type,
    parlay_game_type,

    sport_name,
    league_name,
    home_name,
    away_name,

    bet_builder_market,
    parlay_match_void_description,

    lottery_league_name,
    lottery_total_match,
    lottery_jackpot_type,
  } = record
  // Lottery
  if (game_type === 4000) {
    if (!lottery_league_name) return null
    return (
      <Space direction="vertical" size={0}>
        {`Jackpot Pools - ${lottery_league_name} - Pick ${lottery_total_match} - ${gameTypeDescription[game_type]?.long}`}
        {lottery_jackpot_type}
      </Space>
    )
  }

  const SPORT = () => <span>({sport_name})</span>
  const LEAGUE = () => <span className="text-blue">{league_name}</span>
  // Match Parlay(betbuilder), Virtual Sport
  if ([77, 3000].includes(game_type)) {
    const splitString = bet_builder_market?.split(' And ')
    return (
      <Space direction="vertical" size={0}>
        <Text strong>{gameTypeDescription[game_type]?.long}</Text>
        <SPORT />
        <LEAGUE />
        {`${home_name} vs ${away_name}`}
        {splitString}
      </Space>
    )
  }
  // Outright
  if (game_type === 11) {
    const BET = () => <span className="text-brown">{home_name}</span>
    return (
      <Space direction="vertical" size={0}>
        <SPORT />
        <LEAGUE />
        <BET />
      </Space>
    )
  }

  const MATCH = () => getMatch(record)
  const GAMETYPE = () =>
    game_type === -1 && <Text strong>{gameTypeDescription[parlay_game_type]?.long}</Text>
  const BET = () => getBetSelection(record)
  const PARLAYMATCHVOID = () =>
    game_type === -1 && (
      <Text className="text-blue" italic>
        {parlay_match_void_description}
      </Text>
    )

  return (
    <Space direction="vertical" size={0}>
      <SPORT />
      <LEAGUE />
      <MATCH />
      <GAMETYPE />
      <BET />
      <PARLAYMATCHVOID />
    </Space>
  )
})

export default BetSlip

// BetSlip <FINAL/>, in download bet-enquiry/sagas.js
export const getMatch = (record, textOnly = false) => {
  const {
    sport_name,
    game_type,
    parlay_game_type,
    handicap,
    bet_fav_status,
    ht_score_status,
    ht_home,
    ht_away,
    ft_score_status,
    fs_home,
    fs_away,
    bet_neutral_status,
    home_name,
    away_name,

    lottery_league_name,
    lottery_total_match,
  } = record
  if (game_type === 4000)
    return `Jackpot Pools - ${lottery_league_name} - Pick ${lottery_total_match} - ${gameTypeDescription[game_type]?.long}`
  if (game_type === 11) return ''

  const target_game_type = game_type === -1 ? parlay_game_type : game_type
  const neutral_text = bet_neutral_status === 'Y' ? '(N)' : ''
  let classHome
  let classAway
  let classHandicap
  let handicapDisplay
  if (listGT.Handicap.includes(target_game_type)) {
    if (bet_fav_status === 1) classAway = 'text-red'
    if (bet_fav_status === -1) classHome = 'text-red'

    classHandicap = 'text-maroon text-bold'
    handicapDisplay = getHDCDisplay(handicap)
  } else {
    classHandicap = 'text-blue'
    handicapDisplay = 'vs'
  }

  let FINALSCORE = ''
  if ([2, 6, 16, 8, 36, 13, 17, 1002].includes(target_game_type) && ht_score_status === 'Y') {
    FINALSCORE = `(${ht_home}-${ht_away})`
  } else if (ft_score_status === 'Y') {
    FINALSCORE = `(${fs_home}-${fs_away})`
  }
  // if sportname mbasketball remove finalscore
  if (sport_name === 'M Basketball') FINALSCORE = ''

  if (textOnly) {
    return `${neutral_text}${home_name} ${handicapDisplay} ${away_name} ${FINALSCORE}`
  }
  return (
    <>
      {neutral_text}
      <span className={classHome}>{home_name}</span>
      <span className={classHandicap}> {handicapDisplay} </span>
      <span className={classAway}>{away_name}</span>
      <span className="text-green"> {FINALSCORE}</span>
    </>
  )
}
// BetSlip <BET/>, in download bet-enquiry/sagas.js
export const getBetSelection = (record, textOnly = false) => {
  const {
    game_type,
    parlay_game_type,
    handicap,
    bet_choice,
    home_name,
    away_name,
    odds,
    bet_fav_status,
    choice_name_bti,
  } = record
  if (game_type === 4000) return ''
  if (game_type === 11) return home_name

  const target_game_type = game_type === -1 ? parlay_game_type : game_type
  const BETSCORE = getBetScore(record, true)
  const HANDICAPDISPLAY = getHDCDisplay(handicap)
  const BETCHOICE = getBetChoice(bet_choice, home_name, away_name)
  const ODDS = `@ ${amount(odds, 3)}`

  let sign = ''
  if (textOnly && listGT.Handicap.includes(target_game_type)) {
    if (bet_fav_status === -1 && handicap !== 0) sign = '-'
    else if (bet_fav_status === 1 && handicap !== 0) sign = '+'
  }

  let result = []
  // new bti priority
  if (choice_name_bti) result = [null, `${choice_name_bti}`, ODDS]
  else if (listGT.Handicap.includes(target_game_type)) {
    if (textOnly) result = [BETSCORE, `${BETCHOICE} ${sign}${HANDICAPDISPLAY}`, ODDS]
    else result = [BETSCORE, `${BETCHOICE}`, ODDS]
  } else if (listGT.OverUnder.includes(target_game_type))
    result = [BETSCORE, `${BETCHOICE} ${HANDICAPDISPLAY}`, ODDS]
  else if (
    listGT.OddEven.includes(target_game_type) ||
    listGT['1X2'].includes(target_game_type) ||
    [59, 60].includes(target_game_type) ||
    [63, 64].includes(target_game_type) ||
    [1001, 1002, 7, 9, 15, 20, 28].includes(game_type)
  )
    result = [BETSCORE, BETCHOICE, ODDS]
  else if (game_type === 39) {
    const handicapDisplay3WH = getHDCDisplay3WH(bet_choice, handicap)
    result = [BETCHOICE, handicapDisplay3WH, ODDS]
  } else result = [null, BETCHOICE, ODDS]

  if (textOnly) return result.join(' ')
  return (
    <>
      {result[0] && <span className="text-blue">{result[0]}</span>}
      <span className="text-brown"> {result[1]}</span>
      <span className="text-red"> {result[2]}</span>
    </>
  )
}
export const getBetScore = (record, brackets = false) => {
  if (!record) return null
  const { game_type, parlay_game_type, bet_live_status, bet_score_home, bet_score_away } = record
  const target_game_type = game_type === -1 ? parlay_game_type : game_type

  const result = brackets
    ? `(${bet_score_home}-${bet_score_away})`
    : `${bet_score_home}-${bet_score_away}`
  if (
    bet_live_status === 'Y' &&
    (listGT['1X2'].includes(target_game_type) ||
      listGT.Handicap.includes(target_game_type) ||
      listGT.OverUnder.includes(target_game_type) ||
      listGT.OddEven.includes(target_game_type) ||
      listGT.MoneyLine.includes(target_game_type) ||
      [1001, 1002, 7, 9, 15, 20, 28].includes(game_type) ||
      [59, 60].includes(target_game_type) ||
      [63, 64].includes(target_game_type))
  )
    return result
  return ''
}
