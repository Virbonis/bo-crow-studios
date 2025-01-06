import { useQuery } from 'react-query'
import apiClient from 'services/axios'
import { sortBy } from 'lodash'
import { transmuteData } from '../shared-components/query'

export const QueryDeadball = payload => {
  // enable = if param.game_type_deadball DBOUT, check if outright_date is not empty
  const enable = payload?.early_date?.length > 0
  return useQuery(
    ['trading-deadball', payload],
    () =>
      apiClient.get('/trading-deadball', { params: payload }).then(response => {
        const tableData = transmuteData(
          response?.data?.data.result,
          payload.match_time_slot,
          payload.game_type_deadball !== 'DBOUT' ? 'match_id' : 'outright_id',
        )
        const pausedMatches = response?.data?.data.result_paused_matches || []
        return {
          tableData,
          pausedMatches: sortBy(
            pausedMatches.map(e => ({
              match_id: e.no_partai,
              index: tableData.findIndex(v => e.no_partai === v.match_id),
            })),
            'index',
          ),
          total_paused_matches: response?.data?.data.total_paused_matches,
          lastFetchGameType: payload.game_type_deadball, // this is to prevent table from direct-re-rendering when game_type is changed
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

export default QueryDeadball
