import { notification } from 'antd'
import { useQuery } from 'react-query'
import apiClient from 'services/axios'
import produce from 'immer'
import { queryClient } from 'index'

export const QueryMO5CS = payload => {
  const queryKey = ['mo5cs', payload.popup_id, payload.ftht, payload.match_time_slot]
  return useQuery(
    queryKey,
    () =>
      apiClient
        .get('/mo5cs', {
          params: {
            ...payload,
            match_time_slot: `MO-${payload.match_time_slot}`,
          },
        })
        .then(response => response?.data?.data),
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
// callback Event
// beda sama MO5, ada game_type
export const ReloadPartaiRow = async payload => {
  const queryKey = ['mo5cs', payload.popup_id, payload.ftht, payload.match_time_slot]

  const newData = await apiClient
    .get('/mo5cs/partai', {
      params: {
        ...payload,
        match_time_slot: `MO-${payload.match_time_slot}`,
      },
    })
    .then(response => {
      return response?.data?.data
    })
    .catch(() => {
      notification.warning({ message: 'failed to fetch match data' })
    })
  if (newData) {
    queryClient.setQueryData(queryKey, old =>
      produce(old, draftState => {
        newData.forEach(item => {
          const index = draftState.findIndex(x => x.ArrMatch.row_id === item.ArrMatch.row_id)
          draftState[index] = item
        })
      }),
    )
  } else queryClient.invalidateQueries(queryKey)
}

export default { QueryMO5CS }
