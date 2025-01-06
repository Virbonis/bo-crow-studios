import { useQuery } from 'react-query'
import apiClient from 'services/axios'
import { transmuteData } from '../shared-components/query'

const QueryRunningBallPopUp = payload => {
  const params = payload
  return useQuery(
    ['trading-running-ball-popup', params],
    () =>
      apiClient.get('/trading-running-ball/popup', { params }).then(response => {
        return {
          tableData: transmuteData(response?.data?.data.result),
          pendingSummaryData: response?.data?.data.result_pending_summary,
          pendingData: response?.data?.data.result_pending,
          acceptData: response?.data?.data.result_accept,
          rejectData: response?.data?.data.result_reject,
        }
      }),
    {
      enabled: !!params?.match_id,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchInterval: params.interval * 1000 || false,
      refetchIntervalInBackground: true,
    },
  )
}

export default QueryRunningBallPopUp
