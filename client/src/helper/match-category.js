import { isEmpty } from 'lodash'
import { categoryName } from './const'

const categoryOptions = Object.entries(categoryName).map(([value, label]) => ({
  value,
  label,
}))

export const applyFilterCategories = (category, leagueCategory) => {
  let result = []
  if (!isEmpty(leagueCategory)) {
    const lc = leagueCategory.split('^')
    result = categoryOptions.filter(cat => lc.includes(cat.value))
  }
  if (!isEmpty(category)) {
    const c = category.split('^')
    result = result.map(cat => ({
      ...cat,
      checked: c.includes(cat.value),
    }))
  }
  return result
}

export default applyFilterCategories
