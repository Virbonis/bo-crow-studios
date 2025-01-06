import { useQuery } from 'react-query'
import apiClient from 'services/axios'
import TimerFormat from 'helper/timer-format'
import { uniq } from 'lodash'

export const QueryBetList = payload => {
  const params = payload
  return useQuery(
    ['bet-list', params],
    () =>
      apiClient.get('/betlist/trading', { params }).then(response => {
        return response?.data?.data
      }),
    {
      enabled: !!params?.match_id, // The query will not execute until the match_id exists
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchInterval: params.interval * 1000 || false,
      refetchIntervalInBackground: true,
      cacheTime: 1, // disable cache
    },
  )
}

export const transmuteData = (data = [], match_time_slot, groupingKey = 'match_id') => {
  let key = 0
  let prevMatchID
  let prevLeagueName

  const newData = data.reduce((acc, curr) => {
    // add match_time_slot to every object
    curr.match_time_slot = match_time_slot // dipake di moveodds, handicap, submatchsetting

    // normalize outright
    if (groupingKey === 'outright_id') {
      curr.match_id = curr.outright_id
      curr.sub_match_pause_status = curr.sub_match_pause_status === 'N' ? 0 : 1
    }
    const { match_id, league_id, league_name, type } = curr

    // cari index pertama yg match_id sama, yg subMatches type nya belom ada
    const index = acc.findIndex(
      e => e[groupingKey] === curr[groupingKey] && !e.subMatches.some(v => v.type === type),
    )
    // if match is not the same as previous match or
    // if subMatches type already exist in the subMatches array, push with new key
    if (match_id !== prevMatchID || index === -1) {
      if (league_name !== prevLeagueName)
        acc.push({
          league_group: true,
          key: `${key}-${league_id}`,
          league_name,
          match_ids: uniq(data.filter(x => x.league_id === league_id).map(x => x.match_id)),
        })

      if (match_id !== prevMatchID) key += 1
      const { match_elapsed_time, ...restCurr } = curr
      acc.push({
        key: `${key}-${curr.sub_match_id}`,
        ...curr,
        match_date: curr.match_date.formatDate(),
        match_hour: curr.match_date.formatTime(),
        match_elapsed_time: TimerFormat(curr.match_round, curr.match_elapsed_time),
        last_accept_pending_tickets: TimerFormat(null, curr.last_accept_pending_tickets),
        subMatches: [restCurr],
      })
    } else {
      const { match_elapsed_time, ...restCurr } = curr
      acc[index].subMatches.push(restCurr)
    }

    prevLeagueName = league_name
    prevMatchID = match_id
    return acc
  }, [])

  // add props rowSpan and rowNumber
  const isFirstRow = keyFinder => {
    const index = newData.findIndex(x => x.key === keyFinder)
    if (index === -1) return false
    if (index === 0) return true
    const prev = newData[index - 1]
    const item = newData[index]
    return prev.league_id !== item.league_id || prev.match_id !== item.match_id
  }
  const rowCount = keyFinder => {
    const item = newData.find(x => x.key === keyFinder)
    return newData.filter(x => x.league_id === item.league_id && x.match_id === item.match_id)
      .length
  }
  const getRowSpan = keyFinder => {
    if (!isFirstRow(keyFinder)) return 0
    return rowCount(keyFinder)
  }
  newData.forEach((item, index) => {
    if (item.league_group) {
      newData[index].rowSpan = 1
      return
    }
    newData[index].rowSpan = getRowSpan(item.key)
    const [rowNumber] = item.key.split('-')
    newData[index].rowNumber = rowNumber
  })

  return newData
}
// put a rowSpan for the every element of the array,
// the rules is:
// 1. if thats a league_group just give rowSpan = 1
// 2. for every first match item, give rowSpan as count as same match_id
// 3. if thats not the first so the rowSpan just 0

export default QueryBetList
