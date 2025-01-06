import { listGT } from './game-type'

export const ListGTForecastScoreHomeAwayFT = [0, 1, 12, 15, 59, 60, 1001, 9, 20, 28, 63, 64] // AH, 1X2, ML, DC, NC, NG, CS, HTFT, BTTS, DNB, WNW
export const ListGTForecastScoreHomeAwayFH = [2, 8, 17, 1002] // AH, 1X2, ML, CS
export const ListGTForecastScoreHomeAwayGAH = [50] // GAH
export const ListGTForecastScoreHomeAwaySW = [1101, 1104, 1107, 1110, 1113] // SW
export const ListGTForecastScoreHomeAwaySG = [1102, 1105, 1108, 1111, 1114] // SETGAH
export const ListGTForecastScoreHomeAwayQ1 = [1241, 1253] // AH, ML
export const ListGTForecastScoreHomeAwayQ2 = [1242, 1254]
export const ListGTForecastScoreHomeAwayQ3 = [1243, 1255]
export const ListGTForecastScoreHomeAwayQ4 = [1244, 1256]
export const ListGTForecastScoreTotalScoreFT = [5, 7] // OU, TG
export const ListGTForecastScoreTotalScoreFH = [6, 36] // OU, TG
export const ListGTForecastScoreTotalScoreGOU = [61] // GOU
export const ListGTForecastScoreTotalScoreSW = []
export const ListGTForecastScoreTotalScoreSG = [1103, 1106, 1109, 1112, 1115] // SETGOU
export const ListGTForecastScoreTotalScoreQ1 = [1245] // OU
export const ListGTForecastScoreTotalScoreQ2 = [1246]
export const ListGTForecastScoreTotalScoreQ3 = [1247]
export const ListGTForecastScoreTotalScoreQ4 = [1248]

export const CountWL_GT = (record, arrScore, arrScoreList, isForecastSingle) => {
  const {
    sport_id, game_type, handicap, bet_score_home, bet_score_away,
    liab_home, liab_away, liab_draw, liab4, liab5, liab6, liab7, liab8, liab9,
    ng_home, ng_away,
  } = record // prettier-ignore

  const st_fav = 'H'
  const currScore = getScore(record)
  const currScoreHome = currScore[0]
  const currScoreAway = currScore[1]

  if (arrScoreList.length === 0) {
    for (let i = 0; i < arrScore.length; i += 1) arrScoreList[i] = 0
  }

  for (let i = 0; i < arrScore.length; i += 1) {
    let skipCSL
    if ([1001, 1002].includes(game_type) && i >= arrScore.length - 3) skipCSL = true
    else skipCSL = isForecastSingle

    const amountWL = CountWL(
      arrScore[i], bet_score_home, bet_score_away, currScoreHome, currScoreAway,
      game_type, handicap, st_fav, sport_id, ng_home, ng_away, skipCSL,
      liab_home, liab_away, liab_draw, liab4, liab5, liab6, liab7, liab8, liab9) // prettier-ignore
    arrScoreList[i] += amountWL
  }
  return arrScoreList
}

export const getScore = record => {
  const { game_type, fs_home, fs_away, ht_home, ht_away, gh_home, gh_away } = record
  if (
    ListGTForecastScoreHomeAwayFT.includes(game_type) ||
    ListGTForecastScoreTotalScoreFT.includes(game_type) ||
    ListGTForecastScoreHomeAwaySW.includes(game_type) ||
    ListGTForecastScoreTotalScoreSW.includes(game_type)
  )
    return [fs_home, fs_away]
  if (
    ListGTForecastScoreHomeAwayFH.includes(game_type) ||
    ListGTForecastScoreTotalScoreFH.includes(game_type)
  )
    return [ht_home, ht_away]
  if (
    ListGTForecastScoreHomeAwayGAH.includes(game_type) ||
    ListGTForecastScoreTotalScoreGOU.includes(game_type) ||
    ListGTForecastScoreHomeAwaySG.includes(game_type) ||
    ListGTForecastScoreTotalScoreSG.includes(game_type) ||
    ListGTForecastScoreHomeAwayQ1.includes(game_type) ||
    ListGTForecastScoreTotalScoreQ1.includes(game_type) ||
    ListGTForecastScoreHomeAwayQ2.includes(game_type) ||
    ListGTForecastScoreTotalScoreQ2.includes(game_type) ||
    ListGTForecastScoreHomeAwayQ3.includes(game_type) ||
    ListGTForecastScoreTotalScoreQ3.includes(game_type) ||
    ListGTForecastScoreHomeAwayQ4.includes(game_type) ||
    ListGTForecastScoreTotalScoreQ4.includes(game_type)
  )
    return [gh_home, gh_away]
  return [0, 0]
}

// untuk hitung score tiap column
export const CountWL = (
  score,
  betScoreHome,
  betScoreAway,
  currScoreHome,
  currScoreAway,
  gameType,
  handicap,
  fav,
  sportID,
  NGHome,
  NGAway,
  skipCSL,
  tLiabHome,
  tLiabAway,
  tLiabDraw,
  tLiab4,
  tLiab5,
  tLiab6,
  tLiab7,
  tLiab8,
  tLiab9,
) => {
  const arScore = score?.split('-')
  let targetScoreHome = 0
  let targetScoreAway = 0

  if (
    ListGTForecastScoreHomeAwayFT.includes(gameType) ||
    ListGTForecastScoreHomeAwayFH.includes(gameType) ||
    ListGTForecastScoreHomeAwayGAH.includes(gameType) ||
    ListGTForecastScoreHomeAwaySW.includes(gameType) ||
    ListGTForecastScoreHomeAwaySG.includes(gameType) ||
    ListGTForecastScoreHomeAwayQ1.includes(gameType) ||
    ListGTForecastScoreHomeAwayQ2.includes(gameType) ||
    ListGTForecastScoreHomeAwayQ3.includes(gameType) ||
    ListGTForecastScoreHomeAwayQ4.includes(gameType)
  ) {
    targetScoreHome = fav === 'H' ? Number(arScore[0]) : Number(arScore[1])
    targetScoreAway = fav === 'H' ? Number(arScore[1]) : Number(arScore[0])
  } else {
    targetScoreHome = Number(arScore[0])
  }

  let A = 0.0
  let X = 0.0
  let Result = 0.0

  // ah, gah, setwinner, setgah
  if (listGT.Handicap.includes(gameType) || listGT.SetWinner.includes(gameType)) {
    A = handicap + betScoreAway - betScoreHome + targetScoreHome - targetScoreAway

    if (Math.abs(A) === 0.125) X = 0.25
    else if (Math.abs(A) === 0.25) X = 0.5
    else if (Math.abs(A) > 0.25) X = 1
    else X = 0

    if (A < 0) Result = X * (sportID === 19 ? tLiabHome : tLiabAway)
    else if (A > 0) Result = X * (sportID === 19 ? tLiabAway : tLiabHome)
    else Result = 0
  }
  // ou, gou, setgou
  else if (listGT.OverUnder.includes(gameType)) {
    A = targetScoreHome + targetScoreAway - handicap // 0.5

    if (Math.abs(A) === 0.125) X = 0.25
    else if (Math.abs(A) === 0.25) X = 0.5
    else if (Math.abs(A) > 0.25) X = 1
    else X = 0

    if (A < 0) Result = X * tLiabAway
    else if (A > 0) Result = X * tLiabHome
    else Result = 0
  }
  // oe, goe
  // else if (listGT.OddEven.includes(gameType)) {
  //   A = targetScoreHome + targetScoreAway
  //   X = A % 2 !== 0 ? 1 : -1
  //   Result = X === 1 ? X * tLiabHome : X * -tLiabAway
  // }
  // draw
  else if (gameType === 4) {
    X = targetScoreHome === targetScoreAway ? 1 : -1
    Result = X === 1 ? X * tLiabHome : X * -tLiabAway * 0.5
  }
  // 1x2, ml, dc, dnb
  else if (
    listGT['1X2'].includes(gameType) ||
    listGT.MoneyLine.includes(gameType) ||
    [15, 28].includes(gameType)
  ) {
    if (targetScoreHome > targetScoreAway) Result = tLiabHome
    else if (targetScoreAway > targetScoreHome) Result = tLiabAway
    else if (targetScoreAway === targetScoreHome) Result = tLiabDraw
  }
  // ng, nc
  else if ([59, 60].includes(gameType)) {
    if (NGHome === 1 && NGAway === 0) {
      Result = tLiabHome
    } else if (NGHome === 0 && NGAway === 1) {
      Result = tLiabAway
    } else {
      A = betScoreAway - betScoreHome + targetScoreHome - targetScoreAway

      if (A < 0) Result = tLiabAway
      else if (A > 0) Result = tLiabHome
      else Result = 0
    }
  }
  // CSL
  else if ([1001, 1002].includes(gameType)) {
    let Score = 0
    if (skipCSL === false) {
      if (currScoreHome > currScoreAway) {
        if (targetScoreHome >= currScoreHome - currScoreAway) Score = currScoreAway
        else if (targetScoreAway > 0) Score = currScoreHome
        else Score = currScoreHome - targetScoreHome
      } else if (currScoreHome < currScoreAway) {
        if (targetScoreAway >= currScoreAway - currScoreHome) Score = currScoreHome
        else if (targetScoreHome > 0) Score = currScoreAway
        else Score = currScoreAway - targetScoreAway
      } else {
        Score = currScoreHome
      }
    }

    if (Score + targetScoreHome === NGHome && Score + targetScoreAway === NGAway) {
      Result = tLiabHome
    } else {
      Result = tLiabAway
    }
  }
  // BTTS
  else if (gameType === 20) {
    let home = 0
    let away = 0

    if (targetScoreHome > 0) home = targetScoreHome
    else if (currScoreHome > 0) home = currScoreHome
    else if (targetScoreHome === 0 && targetScoreAway === 0 && currScoreAway > 0) home = 1
    else home = currScoreHome

    if (targetScoreAway > 0) away = targetScoreAway
    else if (currScoreAway > 0) away = currScoreAway
    else if (targetScoreHome === 0 && targetScoreAway === 0 && currScoreHome > 0) away = 1
    else away = currScoreAway

    Result = home > 0 && away > 0 ? tLiabHome : tLiabAway
  }
  // TG
  else if (gameType === 7) {
    Result = 0
    if (targetScoreHome === 0 || targetScoreHome === 1) Result = tLiabHome
    else if (targetScoreHome === 2 || targetScoreHome === 3) Result = tLiabAway
    else if (targetScoreHome >= 4 && targetScoreHome <= 6) Result = tLiabDraw
    else if (targetScoreHome >= 7) Result = tLiab4
  }
  // FH.TG
  else if (gameType === 36) {
    Result = 0
    if (targetScoreHome === 0 || targetScoreHome === 1) Result = tLiabHome
    else if (targetScoreHome === 2 || targetScoreHome === 3) Result = tLiabAway
    else if (targetScoreHome >= 4) Result = tLiabDraw
  }
  // HTFT
  else if (gameType === 9) {
    let HT = 0
    let FT = 0
    let scoreFT = 0

    if (NGHome === NGAway) HT = 2
    else if (NGHome > NGAway) HT = 1
    else if (NGHome < NGAway) HT = 3

    scoreFT = NGHome - NGAway - targetScoreHome + targetScoreAway
    if (scoreFT === 0) FT = 2
    else if (scoreFT <= -1) FT = 1
    else if (scoreFT >= 1) FT = 3

    if (HT === 1 && FT === 1) Result = tLiabHome
    else if (HT === 1 && FT === 2) Result = tLiabAway
    else if (HT === 1 && FT === 3) Result = tLiabDraw
    else if (HT === 2 && FT === 1) Result = tLiab4
    else if (HT === 2 && FT === 2) Result = tLiab5
    else if (HT === 2 && FT === 3) Result = tLiab6
    else if (HT === 3 && FT === 1) Result = tLiab7
    else if (HT === 3 && FT === 2) Result = tLiab8
    else if (HT === 3 && FT === 3) Result = tLiab9
  }
  // hwnw
  else if (gameType === 63) {
    if (targetScoreHome > targetScoreAway) Result = tLiabHome
    else Result = tLiabAway
  }
  // awnw
  else if (gameType === 64) {
    if (targetScoreAway > targetScoreHome) Result = tLiabHome
    else Result = tLiabAway
  }

  return Result
}

export const GetScoreIndex = (record, arrScoreHDP, arrScoreOU) => {
  let scoreIndexHDP = null // 1=HDP, 2=OU
  let scoreIndexOU = null
  const { match_live_status } = record
  if (match_live_status === 'Y') {
    const currScore = getScore(record)
    const posHome = currScore[0]
    const posAway = currScore[1]

    // HDP
    for (let j = 0; j < arrScoreHDP.length; j += 1) {
      const ha = arrScoreHDP[j].split('-')
      const ScoreHome = Number(ha[0]) || 0
      const ScoreAway = Number(ha[1]) || 0
      if (posHome - posAway === ScoreHome - ScoreAway) {
        scoreIndexHDP = j
      }
    }
    // OU
    for (let j = 0; j < arrScoreOU.length; j += 1) {
      const ha = arrScoreOU[j].split('-')
      const ScoreTotal = Number(ha[0])
      if (posHome + posAway === ScoreTotal) {
        scoreIndexOU = j
      }
    }
  }
  return [scoreIndexHDP, scoreIndexOU]
}

export const RoundWL = (arrScoreList, betAmount, arrBetAmtList) => {
  if (arrScoreList.length === 0 || arrScoreList[0] === '') {
    arrScoreList = null
    arrBetAmtList = null
  } else {
    for (let i = 0; i < arrScoreList.length; i += 1) {
      const amount = parseFloat(arrScoreList[i])
      arrScoreList[i] = amount
      arrBetAmtList[i] = betAmount === 0 ? 0 : (amount / betAmount) * 100
    }
  }
  return [arrScoreList, arrBetAmtList]
}

export const RoundMarginWL = (total, betAmountHDP, betAmountOU) => {
  if (betAmountHDP + betAmountOU === 0) return 0
  const result = (total / (betAmountHDP + betAmountOU)) * 100

  return result
}

export const GetGameTypeForecastLine = gameType => {
  if(ListGTForecastScoreHomeAwayFT.includes(gameType) || ListGTForecastScoreTotalScoreFT.includes(gameType)) return 'FT' // prettier-ignore
  if(ListGTForecastScoreHomeAwayFH.includes(gameType) || ListGTForecastScoreTotalScoreFH.includes(gameType)) return '1H' // prettier-ignore
  if(ListGTForecastScoreHomeAwayGAH.includes(gameType) || ListGTForecastScoreTotalScoreGOU.includes(gameType)) return 'GH' // prettier-ignore
  if (ListGTForecastScoreHomeAwaySW.includes(gameType))
    return `S${ListGTForecastScoreHomeAwaySW.findIndex(e => e === gameType) + 1}`
  // if (ListGTForecastScoreTotalScoreSW.includes(gameType))
  //   return `S${ListGTForecastScoreTotalScoreSW.findIndex(e => e === gameType) + 1}`
  if (ListGTForecastScoreHomeAwaySG.includes(gameType))
    return `S${ListGTForecastScoreHomeAwaySG.findIndex(e => e === gameType) + 1}.GH`
  if (ListGTForecastScoreTotalScoreSG.includes(gameType))
    return `S${ListGTForecastScoreTotalScoreSG.findIndex(e => e === gameType) + 1}.GH`
  if (ListGTForecastScoreHomeAwayQ1.includes(gameType) || ListGTForecastScoreTotalScoreQ1.includes(gameType)) return "Q1" // prettier-ignore
  if (ListGTForecastScoreHomeAwayQ2.includes(gameType) || ListGTForecastScoreTotalScoreQ2.includes(gameType)) return "Q2" // prettier-ignore
  if (ListGTForecastScoreHomeAwayQ3.includes(gameType) || ListGTForecastScoreTotalScoreQ3.includes(gameType)) return "Q3" // prettier-ignore
  if (ListGTForecastScoreHomeAwayQ4.includes(gameType) || ListGTForecastScoreTotalScoreQ4.includes(gameType)) return "Q4" // prettier-ignore
  return ''
}

export const createHDPColumns = (home, away, fs_home, fs_away, isForecastSingle) => {
  const columns = []
  if (!isForecastSingle) {
    fs_home = 0
    fs_away = 0
  }
  for (let i = home; i >= 1; i -= 1) columns.push(`${fs_home + i}-${fs_away}`)
  columns.push(`${fs_home}-${fs_away}`)
  for (let i = 1; i <= away; i += 1) columns.push(`${fs_home}-${fs_away + i}`)
  return columns
}
export const createOUColumns = (home, away, fs_home, fs_away, isForecastSingle) => {
  let score_min = 0
  if (!isForecastSingle) {
    fs_home = 0
    fs_away = 0
  }
  if (fs_home + fs_away > 10) score_min = fs_home + fs_away

  const columns = []
  for (let i = home; i <= away; i += 1) columns.push(`${i + score_min}`)
  return columns
}

export default CountWL_GT
