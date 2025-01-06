import { uniq } from 'lodash'
import { useQuery } from 'react-query'
import apiClient from 'services/axios'

export const QueryRequestMoreOGT = payload => {
  // enable = if param.game_type_deadball DBOUT, check if outright_date is not empty
  const enable = payload?.early_date?.length > 0
  return useQuery(
    ['request-more-ogt', payload],
    () =>
      apiClient.get('/request-more-ogt', { params: payload }).then(response => {
        return {
          tableData: transmuteData(response?.data?.data, payload.match_time_slot),
        }
      }),
    {
      enabled: enable && !!payload?.popup_id, // The query will not execute until the popup_id exists
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchInterval: payload.interval * 1000 || false,
      refetchIntervalInBackground: true,
    },
  )
}

const transmuteData = (data = [], match_time_slot) => {
  let key = 0
  let prevLeagueID
  let prevMatchID

  const newData = data.reduce((acc, curr) => {
    // add match_time_slot to every object
    curr.match_time_slot = match_time_slot

    const { league_id, match_id, league_name } = curr

    // if league is not the same as previous league
    if (league_id !== prevLeagueID)
      acc.push({
        league_group: true,
        key: league_id,
        league_name,
        match_ids: uniq(data.filter(x => x.league_id === league_id).map(x => x.match_id)),
      })
    if (match_id !== prevMatchID) key += 1
    acc.push({
      ...curr,
      key: `${key}-${curr.match_id}`,
      match_date: curr.match_date.formatDate(),
      match_hour: curr.match_date.formatTime(),
      match_start_date: curr.match_start && curr.match_start.formatDate(),
      match_start_hour: curr.match_start && curr.match_start.formatTime(),
      last_request_date: curr.last_request_date && curr.last_request_date.formatDateTime(),
    })
    prevLeagueID = league_id
    prevMatchID = match_id
    return acc
  }, [])
  newData.forEach((item, index) => {
    if (item.league_group) {
      newData[index].rowSpan = 1
      return
    }
    const [rowNumber] = item.key?.split('-')
    newData[index].rowNumber = rowNumber
  })
  return newData
}

export default QueryRequestMoreOGT
