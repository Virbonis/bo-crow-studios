import { useQuery } from 'react-query'
import apiClient from 'services/axios'
import { transmuteData } from '../shared-components/query'

export const QueryDeadballSpecial = payload => {
  return useQuery(
    ['trading-deadball-special', payload],
    () =>
      apiClient.get('/trading-deadball-special', { params: payload }).then(response => {
        return {
          tableData: transmuteData(response?.data?.data, payload.match_time_slot),
          lastFetchGameType: payload.in_game_type, // this is to prevent table from direct-re-rendering when game_type is changed
        }
      }),
    {
      enabled: !!payload?.popup_id, // The query will not execute until the popup_id exists
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchInterval: payload.interval * 1000 || false,
      refetchIntervalInBackground: true,
    },
  )
}

export default QueryDeadballSpecial
