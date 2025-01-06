import { countOddsMargin, getOddsXKey } from 'helper'
import { pickBy, reduce, omit } from 'lodash'

// #region for autocalc oddsx/margin
const getOnValuesChange = form => (changedValues, allValues) => {
  const game_type = Number(Object.keys(changedValues))
  const fieldName = Object.keys(changedValues[game_type])[0]
  if (!fieldName.startsWith('odds')) return // only calc odds

  allValues = allValues[game_type]
  const { st_odds_margin, st_odds_margin2 } = allValues
  if (game_type !== 40) {
    // only 1 margin
    const { odds_margin, ...oddsFields } = pickBy(allValues, (v, key) => key.startsWith('odds'))
    if (st_odds_margin) {
      const oddsXKey = getOddsXKey(game_type)
      const restOddsFields = omit(oddsFields, oddsXKey)
      calcOddsXMargin(restOddsFields, odds_margin, oddsXKey, game_type)
    } else calcOddsMargin(oddsFields, 'odds_margin', game_type)
  } else {
    // CSH, have 2 margin
    const { odds1, odds2, odds3, odds4, odds_margin, odds_margin2 } = allValues
    // margin1
    if (['odds1', 'odds2', 'odds_margin'].includes(fieldName)) {
      if (st_odds_margin) calcOddsXMargin([odds2], odds_margin, 'odds1')
      else calcOddsMargin([odds1, odds2], 'odds_margin', game_type)
    }
    // margin 2
    else if (['odds3', 'odds4', 'odds_margin2'].includes(fieldName)) {
      if (st_odds_margin2) calcOddsXMargin([odds4], odds_margin2, 'odds3', game_type)
      else calcOddsMargin([odds3, odds4], 'odds_margin2', game_type)
    }
  }

  function calcOddsXMargin(oddsFields, odds_margin, oddsXKey) {
    if (!oddsXKey) return
    const totalMargin = reduce(oddsFields, (acc, value) => (value === 0 ? acc : acc + 1 / value), 0)
    let result = odds_margin - totalMargin
    if (result !== 0) result = 1 / result
    if (result < 1) result = 0
    else result = Math.round(result * 100) / 100
    form.setFieldsValue({ [game_type]: { [oddsXKey]: result } })
  }
  function calcOddsMargin(oddsFields, oddsMarginKey = 'odds_margin') {
    form.setFieldsValue({ [game_type]: { [oddsMarginKey]: countOddsMargin(oddsFields) } })
  }
}

export default getOnValuesChange
// #endregion
