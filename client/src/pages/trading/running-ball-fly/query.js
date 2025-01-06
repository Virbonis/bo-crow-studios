import { useQuery } from 'react-query'
import apiClient from 'services/axios'
import { transmuteData } from '../shared-components/query'

const QueryRunningBall = payload => {
  const { autoRefresh, ...params } = payload
  return useQuery(
    ['trading-running-ball', params],
    () =>
      apiClient.get('/trading-running-ball', { params }).then(response => {
        // const pausedMatches = response?.data?.data.result_paused_matches || []
        return {
          tableData: transmuteData(response?.data?.data.result),
          pausedMatches: [],
          // pausedMatches: sortBy(
          //   pausedMatches.map(e => ({
          //     match_id: e.no_partai,
          //     index: tableData.findIndex(v => e.no_partai === v.match_id),
          //   })),
          //   'index',
          // ),
          total_paused_matches: response?.data?.data.total_paused_matches,
        }
      }),
    {
      enabled: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchInterval: params.interval * 1000 || false,
      refetchIntervalInBackground: true,
    },
  )
}

export default QueryRunningBall
