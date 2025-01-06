import { find, findLast } from 'lodash'

export const transmuteDataMO = (data, ftht, hiddenRows, isHideActived) => {
  let newData = data
  // filter ftht
  newData = newData.filter(x => {
    if (ftht === 'FTHT') return true
    if (ftht === 'FT') return x.ArrHDP?.display_admin <= 30
    if (ftht === 'HT') return x.ArrHDP?.display_admin >= 30
    return false
  })
  // hide rows
  if (isHideActived) newData = newData.filter(x => !hiddenRows.includes(x.ArrMatch.row_id))
  // additional props isFirst, isLast, isFirstSub for each match
  newData = newData.map(x => {
    const { row_id, match_id, display_admin } = x.ArrMatch
    const firstRow = find(newData, y => y.ArrMatch.match_id === match_id)
    const lastRow = findLast(newData, y => y.ArrMatch.match_id === match_id)

    const sameSubMatch = newData.filter(
      y =>
        y.ArrMatch.match_id === match_id &&
        y.ArrMatch.display_admin?.toString().length === display_admin?.toString().length,
    )
    return {
      ...x,
      isHidden: hiddenRows.includes(row_id),
      isFirst: firstRow.ArrMatch.row_id === row_id ? 'first-row' : '',
      isLast: lastRow.ArrMatch.row_id === row_id ? 'last-row' : '',
      sameSubMatch,
      isFirstSubMatch: sameSubMatch[0]?.ArrMatch.row_id === row_id,
      sameMatchLength: newData.filter(y => y.ArrMatch.match_id === match_id).length,
    }
  })
  return newData
}
export default transmuteDataMO
