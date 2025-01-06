import { useQuery } from 'react-query'
import apiClient from 'services/axios'

const QueryAcceptRejectViewList = payload => {
  const params = payload
  return useQuery(
    ['acceptrejectview', params],
    () =>
      apiClient.get('/acceptrejectview', { params }).then(response => {
        return response?.data?.data
      }),
    {
      enabled: !!params?.match_id,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchInterval: params.interval * 1000 || false,
      refetchIntervalInBackground: true,
      cacheTime: 1, // disable cache
    },
  )
}

export default QueryAcceptRejectViewList
