import { reverse } from 'lodash'
import { categoryName, priceGroupName } from './const'
import { gameTypeDescription, MapListSpecialBasket } from './game-type'

export const activeOptions = [
  { value: '', label: 'All Status' },
  { value: 'Y', label: 'Active' },
  { value: 'N', label: 'Disabled' },
]

export const sortByOptions = [
  { value: 'Asc', label: 'Asc' },
  { value: 'Desc', label: 'Desc' },
]

export const groupOptions = [
  { value: 0, label: 'All Group' },
  { value: 1, label: 'Major' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'Tournament' },
  { value: 90, label: 'Minor' },
]

export const gameType1x2Options = [
  { value: 1, label: '1X2' },
  { value: 8, label: 'FH. 1X2' },
]

export const getGameTypeOptions = frompage => {
  const gameType = [
    { value: 0, label: 'Handicap' },
    { value: 2, label: 'FH. Handicap' },
    { value: 5, label: 'Over/Under' },
    { value: 6, label: 'FH. Over/Under' },
    { value: 3, label: 'Odd/Even' },
    { value: 16, label: 'FH. Odd/Even' },
    { value: 1, label: '1X2' },
    { value: 8, label: 'FH. 1X2' },
    { value: 15, label: 'Double Chance' },
    { value: 7, label: 'Total Goal' },
    { value: 36, label: 'FH. Total Goal' },
    { value: 9, label: 'Half Time/Full Time' },
    { value: 10, label: 'Correct Score' },
    { value: 1001, label: 'Correct Score (Live)' },
    { value: 13, label: 'FH. Correct Score' },
    { value: 1002, label: 'FH. Correct Score (Live)' },
    { value: 14, label: 'First Goal/Last Goal' },
    { value: 12, label: 'Money Line' },
    { value: 17, label: 'FH. Money Line' },
    { value: -1, label: 'Mix Parlay' },
    { value: 11, label: 'Outright' },
    { value: 20, label: 'Both Teams To Score' },
    { value: 41, label: '2nd Half Both Teams To Score' },
    { value: 37, label: 'Home No Bet' },
    { value: 38, label: 'Away No Bet' },
    { value: 28, label: 'Draw No Bet' },
    { value: 42, label: 'Home to Win Either Half' },
    { value: 43, label: 'Away to Win Either Half' },
    { value: 44, label: 'Home to Win Both Halves' },
    { value: 45, label: 'Away to Win Both Halves' },
    { value: 26, label: 'To Score Both Halves' },
    { value: 46, label: 'Home to Score Both Halves' },
    { value: 47, label: 'Away to Score Both Halves' },
    { value: 30, label: 'Highest Scoring Half' },
    { value: 48, label: 'Highest Scoring Half Home Team' },
    { value: 49, label: 'Highest Scoring Half Away Team' },
    { value: 29, label: 'Half With Most Corners' },
    { value: 23, label: 'Race To 2 Goals' },
    { value: 24, label: 'Race To 3 Goals' },
    { value: 33, label: 'To Win From Behind' },
    { value: 34, label: 'To Win To Nil' },
    { value: 22, label: 'Penalty Awarded' },
    { value: 39, label: '3 Way Handicap' },
    { value: 40, label: 'Clean Sheet' },
    { value: 21, label: 'First Goal Method' },
    { value: 27, label: 'Injury Time Awarded At End Of 2nd Half' },
    { value: 25, label: 'Time Of The First Goal' },
    { value: 35, label: 'Winning Margin' },

    { value: 59, label: 'Next Corner' },
    { value: 60, label: 'Next Goal' },

    { value: 50, label: 'Game Handicap' },
    { value: 61, label: 'Game Over/Under' },
    { value: 62, label: 'Game Odd/Even' },
    { value: 63, label: 'Home Win Not Win' },
    { value: 64, label: 'Away Win Not Win' },

    { value: 1101, label: 'Set 1 Winner' },
    { value: 1102, label: 'Set 1 Game Handicap' },
    { value: 1103, label: 'Set 1 Game Handicap OU' },
    { value: 1116, label: 'Set 1 Game OE' },
    { value: 1104, label: 'Set 2 Winner' },
    { value: 1105, label: 'Set 2 Game Handicap' },
    { value: 1106, label: 'Set 2 Game Handicap OU' },
    { value: 1117, label: 'Set 2 Game OE' },
    { value: 1107, label: 'Set 3 Winner' },
    { value: 1108, label: 'Set 3 Game Handicap' },
    { value: 1109, label: 'Set 3 Game Handicap OU' },
    { value: 1118, label: 'Set 3 Game OE' },
    { value: 1110, label: 'Set 4 Winner' },
    { value: 1111, label: 'Set 4 Game Handicap' },
    { value: 1112, label: 'Set 4 Game Handicap OU' },
    { value: 1119, label: 'Set 4 Game OE' },
    { value: 1113, label: 'Set 5 Winner' },
    { value: 1114, label: 'Set 5 Game Handicap' },
    { value: 1115, label: 'Set 5 Game Handicap OU' },
    { value: 1120, label: 'Set 5 Game OE' },
  ].concat(
    Object.values(MapListSpecialBasket)
      .flat()
      .map(e => ({ value: e, label: gameTypeDescription[e].long })),
  )
  if (frompage?.toLowerCase() === 'breakdown')
    gameType.splice(0, 0, { value: -98, label: '- Forecast -' })
  if (frompage?.toLowerCase() !== 'voidticket') {
    gameType.push(
      { value: 3000, label: 'Bet Builder' },
      { value: 77, label: 'Virtual Sport' },
      { value: 4000, label: 'Lottery' },
    )
  }
  gameType.push({ value: 5000, label: 'BTI' })

  return gameType
}
export const gameTypeOddsLog = [
  { value: 0, label: 'Handicap' },
  { value: 2, label: 'FH. Handicap' },
  { value: 5, label: 'Over/Under' },
  { value: 6, label: 'FH. Over/Under' },
  { value: 3, label: 'Odd/Even' },
  { value: 16, label: 'FH. Odd/Even' },
  { value: 12, label: 'Money Line' },
  { value: 17, label: 'FH. Money Line' },
  { value: 50, label: 'Game Handicap' },
  { value: 61, label: 'Game Over/Under' },
  { value: 62, label: 'Game Odd/Even' },
  { value: 59, label: 'Next Corner' },
  { value: 60, label: 'Next Goal' },
  { value: 1101, label: 'Set 1 Winner' },
  { value: 1102, label: 'Set 1 Game Handicap' },
  { value: 1103, label: 'Set 1 Game Handicap OU' },
  { value: 1116, label: 'Set 1 Game OE' },
  { value: 1104, label: 'Set 2 Winner' },
  { value: 1105, label: 'Set 2 Game Handicap' },
  { value: 1106, label: 'Set 2 Game Handicap OU' },
  { value: 1117, label: 'Set 2 Game OE' },
  { value: 1107, label: 'Set 3 Winner' },
  { value: 1108, label: 'Set 3 Game Handicap' },
  { value: 1109, label: 'Set 3 Game Handicap OU' },
  { value: 1118, label: 'Set 3 Game OE' },
  { value: 1110, label: 'Set 4 Winner' },
  { value: 1111, label: 'Set 4 Game Handicap' },
  { value: 1112, label: 'Set 4 Game Handicap OU' },
  { value: 1119, label: 'Set 4 Game OE' },
  { value: 1113, label: 'Set 5 Winner' },
  { value: 1114, label: 'Set 5 Game Handicap' },
  { value: 1115, label: 'Set 5 Game Handicap OU' },
  { value: 1120, label: 'Set 5 Game OE' },
]
  .concat(
    Object.values(
      MapListSpecialBasket.MainQuarter.map(e => ({
        value: e,
        label: gameTypeDescription[e].long,
      })),
    ),
  )
  .concat({ value: 5000, label: 'BTI' })

export const gameTypeForInstantBet = [
  // { value: '-99', label: '*SHOW ALL' },
  { value: '-3', label: '*OtherGT' },
  { value: '-2', label: '*COMBO' },
  { value: '-1', label: '*PARLAY' },
  { value: '0,2', label: 'HDP' },
  { value: '5,6', label: 'OU' },
  { value: '3,16', label: 'OE' },
  { value: '1,8', label: '1X2' },
  { value: '15', label: 'DC' },
  { value: '7,36', label: 'TG' },
  { value: '9', label: 'HTFT' },
  { value: '10,13,1001,1002', label: 'CS' },
  { value: '14', label: 'FGLG' },
  { value: '12,17', label: 'ML' },
  { value: '11', label: 'OUTRIGHT' },
  { value: '59', label: 'NC' },
  { value: '60', label: 'NG' },
  { value: '20', label: 'BTTS' },
  { value: '41', label: '2BTTS' },
  { value: '37', label: 'HNB' },
  { value: '38', label: 'ANB' },
  { value: '28', label: 'DNB' },
  { value: '42', label: 'HWEH' },
  { value: '43', label: 'AWEH' },
  { value: '44', label: 'HWBH' },
  { value: '45', label: 'AWBH' },
  { value: '26', label: 'TSBH' },
  { value: '46', label: 'HSBH' },
  { value: '47', label: 'ASBH' },
  { value: '30', label: 'HSH' },
  { value: '48', label: 'HSHHT' },
  { value: '49', label: 'HSHAT' },
  { value: '29', label: 'HWMC' },
  { value: '23', label: 'RT2G' },
  { value: '24', label: 'RT3G' },
  { value: '33', label: 'TWFB' },
  { value: '34', label: 'TWTN' },
  { value: '22', label: 'PA' },
  { value: '39', label: '3WH' },
  { value: '40', label: 'CSH' },
  { value: '21', label: 'FGM' },
  { value: '27', label: 'ITA' },
  { value: '25', label: 'TOTFG' },
  { value: '35', label: 'WN' },
  { value: '50', label: 'G.AH' },
  { value: '61', label: 'G.OU' },
  { value: '62', label: 'G.OE' },
  { value: '63', label: 'HWNW' },
  { value: '64', label: 'AWNW' },
  { value: '1101', label: 'S1.W' },
  { value: '1102', label: 'S1.GH' },
  { value: '1103', label: 'S1.OU' },
  { value: '1116', label: 'S1.OE' },
  { value: '1104', label: 'S2.W' },
  { value: '1105', label: 'S2.GH' },
  { value: '1106', label: 'S2.OU' },
  { value: '1117', label: 'S2.OE' },
  { value: '1107', label: 'S3.W' },
  { value: '1108', label: 'S3.GH' },
  { value: '1109', label: 'S3.OU' },
  { value: '1118', label: 'S3.OE' },
  { value: '1110', label: 'S4.W' },
  { value: '1111', label: 'S4.GH' },
  { value: '1112', label: 'S4.OU' },
  { value: '1119', label: 'S4.OE' },
  { value: '1113', label: 'S5.W' },
  { value: '1114', label: 'S5.GH' },
  { value: '1115', label: 'S5.OU' },
  { value: '1120', label: 'S5.OE' },
]
  .concat(
    Object.values(MapListSpecialBasket)
      .flat()
      .map(e => ({ value: `${e}`, label: gameTypeDescription[e].long })),
  )
  .concat([
    { value: '3000', label: 'BB' },
    { value: '77', label: 'VS' },
    { value: '5000', label: 'BTI' },
  ])

export const categoryOptions = [{ value: '-99', label: 'Show All' }].concat(
  Object.keys(categoryName).map(key => ({
    value: key,
    label: categoryName[key],
  })),
)

export const sortOptions = [
  { label: 'English', value: 'Nama_Events' },
  { label: 'Seq Non Live', value: 'No_Display' },
  { label: 'Seq Live', value: 'No_Display_Live' },
]

export const priceGroupOptions = Object.entries(priceGroupName).map(([key, value]) => ({
  value: parseInt(key, 10),
  label: value,
}))

export const range = (start, stop, step = 1) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step)
export const oddsOptions = range(-30, 30).map(i => ({ value: i, label: i }))
export const spreadOptions = reverse(range(4, 50)).map(i => ({
  value: i,
  label: i,
  className: 'px-0',
}))
export const spreadDiffOptions = reverse(range(-50, 50)).map(i => ({ value: i, label: i }))
export const oddsDiffOptions = reverse(range(-30, 30)).map(i => ({ value: i, label: i }))
export const ldiffEuroOptions = reverse(range(-3, 3, 0.1)).map(i => ({
  value: i.toFixed(1) * 1,
  label: i.toFixed(1),
}))
export const ldiffOEOptions = reverse(range(-1, 1, 0.1)).map(i => ({
  value: i.toFixed(1) * 1,
  label: i.toFixed(1),
}))

export const getRoundOptions = sport_id => {
  if (sport_id === 10)
    return [
      { value: 0, label: 'Not Played' },
      { value: 1, label: '1st Start' },
      { value: 2, label: 'HT' },
      { value: 3, label: '2nd Start' },
      { value: 4, label: 'FT' },
      { value: 5, label: 'Extra Time 1' },
      { value: 7, label: 'ET HT' },
      { value: 6, label: 'Extra Time 2' },
    ]
  if (sport_id === 12 || sport_id === 58)
    return [
      { value: 0, label: 'Not Played' },
      { value: 11, label: 'Q1' },
      { value: 12, label: 'Q2' },
      { value: 13, label: 'Q3' },
      { value: 14, label: 'Q4' },
      { value: 15, label: '1H' },
      { value: 16, label: '2H' },
      { value: 19, label: 'OT' },
    ]
  if (sport_id === 56)
    return [
      { value: 0, label: 'Not Played' },
      { value: 31, label: 'Round 1' },
      { value: 32, label: 'Round 2' },
      { value: 33, label: 'Round 3' },
      { value: 34, label: 'Round 4' },
      { value: 35, label: 'Round 5' },
    ]
  return []
}

export const resultStateOptions = [
  { value: '', label: '-' },
  { value: 'FT', label: 'FT' },
  { value: 'ET', label: 'ET' },
  { value: 'PEN', label: 'PEN' },
]

export default activeOptions
