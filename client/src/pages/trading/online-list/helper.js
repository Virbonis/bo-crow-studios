export const genScoreSubList = (home, away, fav, custom_score, EvRound, game_type) => {
  const custom_scores = custom_score?.split('-')
  let custom_score_home = 0
  let custom_score_away = 0

  if (custom_score.length > 0) {
    if (
      EvRound >= 3 &&
      (game_type === 2 || game_type === 6 || game_type === 16 || game_type === 8)
    ) {
      if (fav === 'H') {
        custom_score_home = home + 3
        custom_score_away = away
      } else {
        custom_score_home = away + 3
        custom_score_away = home
      }
    } else {
      custom_score_home = parseInt(custom_scores[0], 10)
      custom_score_away = parseInt(custom_scores[1], 10)
    }
  } else {
    if (fav === 'H') {
      custom_score_home = home + 3
      custom_score_away = away
    }
    if (fav === 'A') {
      custom_score_home = away + 3
      custom_score_away = home
    }
  }

  let scoreList = ''

  if (fav === 'H') {
    scoreList = [
      `${home}-${away}`,
      `${home + 1}-${away}`,
      `${home}-${away + 1}`,
      `${home + 2}-${away}`,
      `${home}-${away + 2}`,
      `${custom_score_home}-${custom_score_away}`,
    ]
  } else if (fav === 'A') {
    scoreList = [
      `${away}-${home}`,
      `${away + 1}-${home}`,
      `${away}-${home + 1}`,
      `${away + 2}-${home}`,
      `${away}-${home + 2}`,
      `${custom_score_home}-${custom_score_away}`,
    ]
  } else {
    scoreList = [
      `${home}-${away}`,
      `${home + 1}-${away}`,
      `${home}-${away + 1}`,
      `${home + 2}-${away}`,
      `${home}-${away + 2}`,
      `${custom_score_home}-${custom_score_away}`,
    ]
  }

  return scoreList
}
export const genScoreSubListNba = (home, away, fav, custom_score, EvRound, game_type) => {
  const custom_scores = custom_score?.split('-')
  let custom_score_home = parseInt(custom_scores[0], 10) || 0
  let custom_score_away = parseInt(custom_scores[1], 10) || 0

  // if empty or evround >= 3
  if (
    !custom_score ||
    (EvRound >= 3 &&
      (game_type === '2' || game_type === '6' || game_type === '16' || game_type === '8'))
  ) {
    if (fav === 'H') {
      custom_score_home = home
      custom_score_away = away
    } else {
      custom_score_home = away
      custom_score_away = home
    }
  }

  const scoreList = [
    setScore(4, custom_score_home, custom_score_away),
    setScore(3, custom_score_home, custom_score_away),
    setScore(2, custom_score_home, custom_score_away),
    setScore(1, custom_score_home, custom_score_away),
    `${custom_score_home}-${custom_score_away}`,
    setScore(-1, custom_score_home, custom_score_away),
    setScore(-2, custom_score_home, custom_score_away),
    setScore(-3, custom_score_home, custom_score_away),
    setScore(-4, custom_score_home, custom_score_away),
  ]
  return scoreList
}
const setScore = (pos, score_home, score_away) => {
  const selisih = score_home - score_away + pos
  if (selisih >= 0) {
    return `${selisih}-0`
  }
  return `0-${Math.abs(selisih)}`
}

export const createDataTotal = (data, header) => {
  return {
    team_a: countTotal(data, 't_home'),
    team_b: countTotal(data, 't_away'),
    draw: countTotal(data, 't_draw'),
    diff: countTotal(data, 't_home') - countTotal(data, 't_away'),
    score1: countTotalWL(data, header[0]),
    score2: countTotalWL(data, header[1]),
    score3: countTotalWL(data, header[2]),
    score4: countTotalWL(data, header[3]),
    score5: countTotalWL(data, header[4]),
    score6: countTotalWL(data, header[5]),
    score7: countTotalWL(data, header[6]),
    score8: countTotalWL(data, header[7]),
    score9: countTotalWL(data, header[8]),
  }
}

const countTotal = (data, params) => {
  return data.reduce((acc, curr) => {
    acc += curr[params]
    return acc
  }, 0)
}

const countTotalWL = (data, score) => {
  return data.reduce((acc, curr) => {
    acc += countWL(curr, score)
    return acc
  }, 0)
}

export const countWL = (
  {
    game_type,
    handicap,
    home_posisi,
    away_posisi,
    liab_home,
    liab_away,
    liab_draw,
    sub_match_st_fav,
  },
  score,
) => {
  if (!score) return 0
  const arScore = score?.split('-')

  let ScoreHome = 0
  let ScoreAway = 0
  if (sub_match_st_fav === 'H') {
    ScoreHome = parseInt(arScore[0], 10)
    ScoreAway = parseInt(arScore[1], 10)
  } else if (sub_match_st_fav === 'A') {
    ScoreHome = parseInt(arScore[1], 10)
    ScoreAway = parseInt(arScore[0], 10)
  }

  let A = 0
  let X = 0
  let Result = 0

  // todo outdated conditional gametype
  if (game_type === 0 || game_type === 2) {
    A = handicap + away_posisi - home_posisi + ScoreHome - ScoreAway

    if (Math.abs(A) === 0.125) X = 0.25
    else if (Math.abs(A) === 0.25) X = 0.5
    else if (Math.abs(A) > 0.25) X = 1
    else X = 0

    if (A < 0) Result = X * liab_away
    else if (A > 0) Result = X * liab_home
    else Result = 0
  } else if (game_type === 5 || game_type === 6 || game_type === 7 || game_type === 36) {
    A = ScoreHome + ScoreAway - handicap

    if (Math.abs(A) === 0.125) X = 0.25
    else if (Math.abs(A) === 0.25) X = 0.5
    else if (Math.abs(A) > 0.25) X = 1
    else X = 0

    if (A < 0) Result = X * liab_away
    else if (A > 0) Result = X * liab_home
    else Result = 0
  } else if (game_type === 3 || game_type === 16) {
    A = ScoreHome + ScoreAway
    X = A % 2 !== 0 ? 1 : -1
    Result = X === 1 ? X * liab_home : X * -liab_away
  } else if (game_type === 4) {
    X = ScoreHome === ScoreAway ? 1 : -1
    Result = X === 1 ? X * liab_home : X * -liab_away * 0.5
  } else if (game_type === 1 || game_type === 8) {
    // X = ScoreHome - ScoreAway;
    if (ScoreHome > ScoreAway) Result = liab_home
    else if (ScoreAway > ScoreHome) Result = liab_away
    else if (ScoreAway === ScoreHome) Result = liab_draw
  }
  return Result
}
