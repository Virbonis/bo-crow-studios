import React from 'react'
import { DatePicker } from 'antd'
import { amount, getBetSelection } from 'components/blaise'
import { Download } from 'utils'
import { platform } from './const'
import { getBetChoice } from './bet-choice'
import {
  ListChoiceBasketByGameType,
  ListGTScoringCanDraw,
  ListGTScoringDropdown,
  ListGTScoringInput,
  gameTypeDescription,
} from './game-type'
import { getOddsTypeDescByOddsType } from './odds-type'

export const getVIPColorClass = code => {
  const vip = code.split('^')
  // order by priority
  if (vip.includes('27')) return 'vip_27'
  if (vip.includes('28')) return 'vip_28'
  if (vip.includes('23') && !vip.includes('24')) return 'vip_23'
  if (vip.includes('29')) return 'vip_29'
  if (vip.includes('18')) return 'vip_18'
  if (vip.includes('15')) return 'vip_15'
  if (vip.includes('8')) return 'vip_8'
  if (vip.includes('11')) return 'vip_11'
  if (vip.includes('9')) return 'vip_9'
  if (vip.includes('17')) return 'vip_17'
  if (
    vip.includes('14') ||
    vip.includes('13') ||
    vip.includes('10') ||
    vip.includes('4') ||
    vip.includes('2')
  ) {
    const firstVipText = vip.find(
      v => v === '14' || v === '13' || v === '10' || v === '4' || v === '2',
    )
    return `vip_${firstVipText}`
  }
  if (vip.includes('12')) return 'vip_12'
  if (vip.includes('1') || vip.includes('3')) {
    const firstVipText = vip.find(v => v === '1' || v === '3')
    return `vip_${firstVipText}`
  }
  if (vip.includes('16')) return 'vip_16'
  if (vip.includes('5')) return 'vip_5'
  if (vip.includes('6')) return 'vip_6'
  if (vip.includes('7') && vip.includes('26')) return 'vip_7_26'
  if (vip.includes('7')) return 'vip_7'
  if (vip.includes('21')) return 'vip_21'
  if (vip.includes('23') && vip.includes('24')) return 'vip_23_24'
  if (vip.includes('24')) return 'vip_24'
  if (vip.includes('25')) return 'vip_25'
  if (vip.includes('26')) return 'vip_26'
  return ''
}

export const getPlatform = txn_type => {
  if (!txn_type) return ''
  const platformText = platform[txn_type.toUpperCase()]
  return platformText || txn_type
}

export const getTraderDBRBPick = trader => {
  if (!trader) return [[], [], []]

  const data = trader.split(';')
  const dataRB = data.filter(x => x.substring(0, 2).toLowerCase() === 'rb')
  const dataDB = data.filter(x => x.substring(0, 2).toLowerCase() === 'db')
  const dataPick = data.filter(x => x.substring(0, 4).toLowerCase() === 'pick')
  return [dataRB, dataDB, dataPick]
}

export const getParlayComboTicket = folds => {
  if (folds === 2) return 'Doubles'
  if (folds === 3) return 'Trebles'
  return `${folds}-folds`
}

// winLossStatusName for per ticket
export const getWinlossStatus = ({
  void_id,
  void_desc,
  void_user,
  winloss_status,
  jwl,
  game_type,
}) => {
  void_id = void_id.toString()
  if (void_id && void_id !== '0')
    return (
      <>
        <div className="text-danger">{void_desc}</div>
        by {void_user}
      </>
    )
  if ([-1, 11].includes(game_type)) return getWinlossStatusName(winloss_status, 0)
  return getWinlossStatusName(winloss_status, jwl)
}
// winLossStatusName for per match
export const getWinlossStatusName = (status, jwl) => {
  switch (status?.toUpperCase()) {
    case 'W': {
      if (jwl === 0.5) return <span className="text-green">Win Half</span>
      return <span className="text-green">Win</span>
    }
    case 'L': {
      if (jwl === 0.5) return <span className="text-red">Loss Half</span>
      return <span className="text-red">Loss</span>
    }
    case 'D':
      return <span className="text-blue">Draw</span>
    case 'C':
      return 'Cancel'
    case 'P':
      return <span style={{ backgroundColor: 'red', color: 'white' }}>Postponed</span>
    default:
      return null
  }
}

export const getWinlossStatusExport = ({ void_id, void_desc, void_user, winloss_status, jwl }) => {
  if (void_id && void_id.toString() !== '0' && !winloss_status) {
    return `${void_desc} by ${void_user}`
  }
  return getWinlossStatusNameExport(winloss_status, jwl)
}
export const getWinlossStatusNameExport = (winloss_status, jwl) => {
  switch (winloss_status?.toUpperCase()) {
    case '':
      return 'Running'
    case 'W':
      return jwl === 0.5 ? 'Win Half' : 'Win'
    case 'L':
      return jwl === 0.5 ? 'Loss Half' : 'Loss'
    case 'D':
      return 'Draw'
    case 'C':
      return 'Cancel'
    case 'P':
      return 'Postponed'
    default:
      return null
  }
}

export const getScoreGameTypeFGLG = (fg_team, lg_team) => {
  if (fg_team === 0 && lg_team === 0) return 'No Score'
  return `${getScoreFGLGText(fg_team)} - ${getScoreFGLGText(lg_team)}`
}
export const getScoreFGLGText = score => {
  switch (score) {
    case 0:
      return 'No Goal'
    case -1:
      return 'Home'
    case 1:
      return 'Away'
    case 2:
      return <span type="danger">Cancelled</span>
    default:
      return score
  }
}

export const getScoreGameTypeSpecial = (game_type, ht_home, ht_away, fs_home, fs_away) => {
  if (game_type === 20) {
    switch (fs_home) {
      case 1:
        return 'Yes'
      case -1:
        return 'No'
      default:
        return ''
    }
  } else if (game_type === 41) {
    if (fs_home * 1 > ht_home * 1 && fs_away * 1 > ht_away * 1) return 'Yes'
    return 'No'
  } else if (
    game_type === 37 ||
    game_type === 38 ||
    game_type === 28 ||
    game_type === 34 ||
    game_type === 39 ||
    game_type === 50 ||
    game_type === 59 ||
    game_type === 60 ||
    (game_type >= 1101 && game_type <= 1115)
  ) {
    return `FS: ${fs_home} - ${fs_away}`
  } else if (game_type === 42) {
    // HWEH
    if (ht_home * 1 > ht_away * 1 || fs_home * 1 > fs_away * 1) {
      return 'Yes'
    }
    return 'No'
  } else if (game_type === 43) {
    // AWEH
    if (ht_away * 1 > ht_home * 1 || fs_away * 1 > fs_home * 1) {
      return 'Yes'
    }
    return 'No'
  } else if (game_type === 44) {
    // HWBH
    if (ht_home * 1 > ht_away * 1 && (fs_home - ht_home) * 1 > (fs_away - ht_away) * 1) {
      return 'Yes'
    }
    return 'No'
  } else if (game_type === 45) {
    // AWBH
    if (ht_away * 1 > ht_home * 1 && (fs_away - ht_away) * 1 > (fs_home - ht_home) * 1) {
      return 'Yes'
    }
    return 'No'
  } else if (game_type === 26) {
    // TSBH
    if (fs_home === 0 && fs_away === 0) return 'None'
    if (fs_home === 1 && fs_away === 0) return 'Home'
    if (fs_home === 0 && fs_away === 1) return 'Away'
    if (fs_home === 1 && fs_away === 1) return 'Both'
  } else if (game_type === 46) {
    // HSBH
    if (ht_home * 1 > 0 && fs_home * 1 > ht_home * 1) {
      return 'Yes'
    }
    return 'No'
  } else if (game_type === 47) {
    // ASBH
    if (ht_away * 1 > 0 && fs_away * 1 > ht_away * 1) {
      return 'Yes'
    }
    return 'No'
  } else if (game_type === 30) {
    // HSH
    if (fs_home * 1 + fs_away * 1 - (ht_home * 1 + ht_away * 1) < ht_home * 1 + ht_away * 1) {
      return '1st Half'
    }
    if (fs_home * 1 + fs_away * 1 - (ht_home * 1 + ht_away * 1) > ht_home * 1 + ht_away * 1) {
      return '2nd Half'
    }
    return 'Draw'
  } else if (game_type === 48) {
    // HSHHT
    if (ht_home * 1 > fs_home * 1 - ht_home * 1) {
      return '1st Half'
    }
    if (ht_home * 1 < fs_home * 1 - ht_home * 1) {
      return '2nd Half'
    }
    return 'Draw'
  } else if (game_type === 49) {
    // HSHAT
    if (ht_away * 1 > fs_away * 1 - ht_away * 1) {
      return '1st Half'
    }
    if (ht_away * 1 < fs_away * 1 - ht_away * 1) {
      return '2nd Half'
    }
    return 'Draw'
  } else if (game_type === 29) {
    // HWMC
    return `HT: ${ht_home} - ${ht_away} 
    FS: ${fs_home} - ${fs_away}`
  } else if (game_type === 23 || game_type === 24 || game_type === 33) {
    // 23 = RT2G /24 = RT3G/333 = TWFB
    switch (fs_home) {
      case -1:
        return 'None'
      case 1:
        return 'Home'
      case 2:
        return 'Away'
      default:
        return ''
    }
  } else if (game_type === 22) {
    // PA
    switch (fs_home) {
      case 1:
        return 'Yes'
      case -1:
        return 'No'
      default:
        return ''
    }
  } else if (game_type === 40) {
    // CSH
    if (fs_away * 1 === 0 && fs_home * 1 === 0) {
      return 'Home Yes, Away Yes'
    }
    if (fs_away * 1 === 0 && fs_home * 1 !== 0) {
      return 'Home Yes, Away No'
    }
    if (fs_away * 1 !== 0 && fs_home * 1 === 0) {
      return 'Home No, Away Yes'
    }
    return 'Home No, Away No'
  } else if (game_type === 21) {
    // FGM
    switch (fs_home) {
      case 1:
        return 'Free Kick'
      case 2:
        return 'Header'
      case 3:
        return 'No Goal'
      case 4:
        return 'Own Goal'
      case 5:
        return 'Penalty'
      case 6:
        return 'Shot'
      default:
        return ''
    }
  } else if (game_type === 27) {
    // ITA
    switch (fs_home) {
      case 1:
        return '1 minute'
      case 2:
        return '2 minutes'
      case 3:
        return '3 minutes'
      case 4:
        return '4 minutes'
      case 5:
        return '5 minutes or More'
      case 6:
        return 'None'
      default:
        return ''
    }
  } else if (game_type === 25) {
    // TOTFG
    switch (fs_home) {
      case 1:
        return '27th Minute Onwards'
      case 2:
        return 'Up To And Including The 26th Minute'
      case 3:
        return 'No Goal'
      default:
        return ''
    }
  } else if (game_type === 35) {
    // WM
    switch (fs_home) {
      case 1:
        return 'Any Goal Score Draw'
      case 2:
        return 'Home Team To Win By 1 Goal'
      case 3:
        return 'Home Team To Win By 2 Goal'
      case 4:
        return 'Home Team To Win By 3 Goal'
      case 5:
        return 'Home Team To Win By 4 Or More Goal'
      case 6:
        return 'Away Team To Win By 1 Goal'
      case 7:
        return 'Away Team To Win By 2 Goal'
      case 8:
        return 'Away Team To Win By 3 Goal'
      case 9:
        return 'Away Team To Win By 4 Or More Goal'
      case 10:
        return 'No Goal'
      default:
        return ''
    }
  }
  // #region basket
  else if (ListGTScoringInput.includes(game_type)) return `FS: ${fs_home}-${fs_away}`
  else if (ListGTScoringDropdown.includes(game_type)) {
    const options = [{ value: 0, label: 'Unscored' }].concat(
      ListChoiceBasketByGameType(game_type).map((e, index) => ({
        value: index + 1,
        label: getBetChoice(e),
      })),
    )
    if (ListGTScoringCanDraw.includes(game_type)) options.unshift({ value: -1, label: 'None' })
    const result = options.find(e => e.value === fs_home).label
    return result
  } else if (game_type === 1280) {
    const result = fs_home
      .toString()
      .split('')
      .reduce((acc, curr, index) => {
        acc += `Q${index + 1} ${getResultDoubleQuarterWinner(curr)}\n`
        return acc
      }, '')
    return result
  }
  // #endregion
  return ''
}

export const getResultDoubleQuarterWinner = fs_home => {
  switch (fs_home.toString()) {
    case '1':
      return 'Home Win'
    case '2':
      return 'Away Win'
    case '3':
      return 'AOS'
    default:
      return 'Unscored'
  }
}

export const getEarlySettlement = early_settlement_id => {
  if (early_settlement_id) {
    const early = early_settlement_id?.split('^')
    return `E(${early[1]}-${early[2]})`
  }
  return ''
}

export const getPresetsMinMaxDate = (minDate, maxDate) => {
  const { presets } = DatePicker.RangePicker.defaultProps
  return presets.map(item => {
    let [startValue, endValue] = item.value
    if (minDate && startValue < minDate) startValue = minDate
    if (maxDate && endValue > maxDate) endValue = maxDate
    return { label: item.label, value: [startValue, endValue] }
  })
}

const getBetID = record => {
  if (Number(record.pending_bet_id)) return `${record.bet_id} P(${record.pending_bet_id})`
  return record.bet_id
}
const getBetDate = record => {
  if (Number(record.pending_bet_id)) return `${record.bet_date} - (${record.accept_pending_date})`
  return record.bet_date
}

const getGameType = (game_type, game_type_name_bti, live) => {
  let gameTypeText = gameTypeDescription[game_type]?.long
  if (game_type_name_bti) gameTypeText = game_type_name_bti

  return `${gameTypeText} ${live}`
}

export const DownloadBetReport = (data, fileName) => {
  const transformedData = TransformData(data)
  Download(columnsBetReport, transformedData, fileName)
}

const columnsBetReport = [
  'Username',
  'Bet ID',
  'Bet Date',
  'Platform',
  'Match ID',
  'Sport',
  'League',
  'Home',
  'Away',
  'Game Type',
  'Selection',
  'Odds',
  'Odds Type',
  'HT Home',
  'HT Away',
  'FT Home',
  'FT Away',
  'Currency',
  'Stake (F)',
  'Stake (L)',
  'Result (F)',
  'Result (L)',
  'Status',
  'IP',
  'Early Settlement',
]
const TransformData = data => {
  const dataNew = data.map((e, index) => {
    const live = e.bet_live_status === 'Y' ? '- Live' : ''

    const showed = index === data.findIndex(x => x.bet_id === e.bet_id)
    const d = {
      username: showed ? e.username : '',
      bet_id: showed ? getBetID(e) : '',
      bet_date: showed ? getBetDate(e) : '',
      bet_type: showed && e.bet_type ? getPlatform(e.bet_type) : '',
      match_id: e.match_id,
      sport_name: e.sport_name,
      league_name: e.league_name,
      home_name: e.home_name,
      away_name: e.away_name,
      game_type: showed ? getGameType(e.game_type, e.game_type_name_bti, live) : '',
      selection: getBetSelection({ ...e, odds: e.game_type === -1 ? e.m_odds : e.odds }, true),
      odds: amount(e.odds, 3),
      odds_type: (e.odds_type && getOddsTypeDescByOddsType(e.odds_type)) || '',
      ht_home: e.ht_home || '',
      ht_away: e.ht_away || '',
      fs_home: e.fs_home || '',
      fs_away: e.fs_away || '',
      currency: showed ? e.currency : '',
      bet_amount: showed && e.bet_amount ? amount(e.bet_amount) : '',
      bet_amount_rmb: showed && e.bet_amount_rmb ? amount(e.bet_amount_rmb) : '',
      winloss_amount:
        !showed || (e.void_id && e.void_id !== '0') || e.winloss_status === '' || !e.winloss_amount
          ? ''
          : amount(e.winloss_amount),
      winloss_amount_rmb:
        !showed ||
        (e.void_id && e.void_id !== '0') ||
        e.winloss_status === '' ||
        !e.winloss_amount_rmb
          ? ''
          : amount(e.winloss_amount_rmb),
      status: (showed && getWinlossStatusExport(e)) || '',
      ip: showed ? e.ip : '',
      early_settlement_id: getEarlySettlement(e.early_settlement_id),
    }

    return d
  })

  return dataNew
}

export default getVIPColorClass
