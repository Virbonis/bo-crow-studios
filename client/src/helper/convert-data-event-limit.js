export const convertDataEventLimit = data => {
  function marketGroup(e) {
    switch (e) {
      case 1:
        return 'TM'
      case 2:
        return 'EM'
      case 3:
        return 'TM6'
      default:
        return 'RB'
    }
  }
  return data.flatMap(item => {
    return [2, 1, 4, 3].map(obj => {
      return {
        key: item.game_type.toString().concat(item.game_type_sequence, marketGroup(obj)),
        game_type_sequence: item.game_type_sequence,
        game_type: item.game_type,
        market_group: marketGroup(obj),
        step: item[`step_${obj}`],
        odds_trigger: item[`odds_trigger_${obj}`],
        max_limit: item[`max_limit_${obj}`],
        max_bet: item[`max_bet_${obj}`],
        spread: item[`spread_${obj}`],
      }
    })
  })
}

export default convertDataEventLimit
