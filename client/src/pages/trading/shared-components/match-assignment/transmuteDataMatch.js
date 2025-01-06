const transmuteDataMatch = (dataMatch, selectedData) =>
  dataMatch.map(e => {
    const indexItem = selectedData.findIndex(v => v.match_id === e.match_id)
    if (indexItem !== -1) return { ...e, ...selectedData[indexItem] }
    return { ...e, rb_ht: false, rb_ft: false }
  })

export default transmuteDataMatch

// dataMatch = [{match_id, homeaway, rb_htft}]
// selectedData = [{match_id, rb_ht, rb_ft}]
// transmuteDataMatch = [{match_id, homeaway, rb_htft, rb_ht, rb_ft}]
