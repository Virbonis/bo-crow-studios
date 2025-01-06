import { useQuery } from 'react-query'
import apiClient from 'services/axios'

const QueryAcceptRejectList = (payload, successCallback) => {
  const params = payload
  return useQuery(
    ['acceptreject', params],
    () =>
      apiClient.get('/acceptreject', { params }).then(response => {
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
      onSuccess: successCallback,
    },
  )
}

export default QueryAcceptRejectList
