import { useQuery } from 'react-query'
import apiClient from 'services/axios'

const QueryBasketTimer = payload => {
  const params = payload
  return useQuery(
    ['baskettimer', params],
    () =>
      apiClient.get('/mo5/baskettimer', { params }).then(response => {
        return response?.data?.data
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

export default QueryBasketTimer
