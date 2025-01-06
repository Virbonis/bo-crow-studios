import { isNaN, reduce } from 'lodash'
import { listGT } from './game-type'

export const getOddsTypeDescByOddsType = odds_type => {
  odds_type = odds_type.toString()
  // Buyback
  if (odds_type === '9') {
    return 'B'
  }
  switch (odds_type.charAt(1)) {
    case '0':
      return 'Indo'
    case '1':
      return 'Malay'
    case '2':
      return 'HK'
    case '3':
      return 'DEC'
    default:
      return ''
  }
}

export const isOddsValid = (odds, gameType) => {
  odds = parseFloat(odds, 10)
  if (isNaN(odds)) return [false, 'Odds is not valid']

  const game_type = parseInt(gameType, 10)
  if (listGT.CS.includes(game_type) || listGT.FHCS.includes(game_type))
    if (odds < 0 || odds > 999.99) return [false, 'Odd must be between 0 and 999.99']
  if (listGT.CSLive.includes(game_type) || listGT.FHCSLive.includes(game_type))
    if (odds < 1 || odds > 999.99) return [false, 'Odd must be between 1 and 999.99']
  if (
    listGT.Handicap.includes(game_type) ||
    listGT.OverUnder.includes(game_type) ||
    listGT.OddEven.includes(game_type) ||
    listGT.SetWinner.includes(game_type) ||
    listGT.MoneyLine.includes(game_type)||
    // other odds-malay
    [4, 59, 60, 63, 64, 1201, 1202, 1215, 1216, 1217, 1218, 
    1219, 1220, 1261, 1262, 1263, 1264, 1265, 1266, 1267, 1268, 
    1269, 1270, 1271, 1272, 1273, 1274, 1275, 1276].includes(game_type) // prettier-ignore
  ) {
    if (odds < -1 || odds > 1) return [false, 'Odd must be between -1 and 1']
  }
  // 14=FGLG
  if (game_type === 14) {
    if (odds > 10) return [false, 'Odd must be between 0 and 10']
  }
  if (odds > 999.99) return [false, 'Odd must be between 0 and 999.99']
  return [true]
}

export const getOddsXKey = game_type => {
  switch (game_type) {
    case 41:
    case 42:
    case 43:
    case 44:
    case 45:
    case 46:
    case 47:
      return 'odds1'
    case 20:
    case 26:
    case 34:
    case 37:
    case 38:
      return 'odds2'
    case 36:
      return 'odds3'
    case 7:
      return 'odds4'
    case 14:
      return 'odds5'
    case 40:
      return ['odds1', 'odds3']
    default:
      return ''
  }
}
/**
 * @param {array/object} oddsFields [] | {}
 */
export const countOddsMargin = oddsFields => {
  const totalMargin = reduce(
    oddsFields,
    (acc, value) => {
      if (value !== 0) return acc + 1 / value
      return acc
    },
    0,
  )
  return Math.round(totalMargin * 100) / 100
}
export const countOdds1X2 = (odds1, odds2, odds3, spread) => {
  const OddsPerc1 = 1 / odds1
  const OddsPerc2 = 1 / odds2
  const OddsPerc3 = 1 / odds3
  const OddsPercTotal = OddsPerc1 + OddsPerc2 + OddsPerc3

  const OddsSpread = 1 + spread * 0.01

  let Odds1Res = 1 / ((OddsPerc1 / OddsPercTotal) * OddsSpread)
  let Odds2Res = 1 / ((OddsPerc2 / OddsPercTotal) * OddsSpread)
  let Odds3Res = 1 / ((OddsPerc3 / OddsPercTotal) * OddsSpread)

  if (Odds1Res < 1) Odds1Res = 1
  if (Odds2Res < 1) Odds2Res = 1
  if (Odds3Res < 1) Odds3Res = 1
  return [Odds1Res, Odds2Res, Odds3Res]
}

export default getOddsTypeDescByOddsType
