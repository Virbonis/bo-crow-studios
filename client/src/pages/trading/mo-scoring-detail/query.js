import { useQuery } from 'react-query'
import apiClient from 'services/axios'

export const QueryMOScoreDetail = payload => {
  const params = payload
  return useQuery(
    ['mo5/scoredetail', params],
    () =>
      apiClient.get('/mo5/scoredetail', { params }).then(response => {
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

export default { QueryMOScoreDetail }
