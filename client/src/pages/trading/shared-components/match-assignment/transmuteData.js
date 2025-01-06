const transmuteDataLeague = (dataSource, selectedRows) =>
  dataSource.map(e => {
    if (selectedRows.includes(e.league_id)) return { ...e, checked: true }
    return { ...e, checked: false }
  })

export default transmuteDataLeague
