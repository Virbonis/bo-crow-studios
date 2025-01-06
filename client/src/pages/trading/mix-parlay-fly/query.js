import { useQuery } from 'react-query'
import apiClient from 'services/axios'
import { transmuteData } from '../shared-components/query'

export const QueryMixParlay = payload => {
  return useQuery(
    ['mix-parlay', payload],
    () =>
      apiClient.get('/mix-parlay', { params: payload }).then(response => {
        return transmuteData(response?.data?.data)
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

export default QueryMixParlay
