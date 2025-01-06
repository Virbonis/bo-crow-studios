import { notification } from 'antd'
import { useQuery } from 'react-query'
import apiClient from 'services/axios'
import produce from 'immer'
import { queryClient } from 'index'
import { uniq } from 'lodash'

export const QueryMO5 = (payload, sucessCallback) => {
  const queryKey = ['mo5', payload.popup_id, payload.match_time_slot]

  return useQuery(
    queryKey,
    () =>
      apiClient
        .get('/mo5', {
          params: {
            ...payload,
            match_time_slot: `MO-${payload.match_time_slot}`,
          },
        })
        .then(response => {
          if (typeof sucessCallback === 'function') {
            const matchIDs = response?.data?.data.map(x => x.ArrMatch.match_id)
            sucessCallback(uniq(matchIDs))
          }
          return response?.data?.data
        }),
    {
      enabled: !!payload?.popup_id && payload.match_id !== -1, // The query will not execute until the popup_id exists, or match id not -1
      cacheTime: payload.match_id && 1,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchInterval: payload.interval * 1000 || false,
      refetchIntervalInBackground: true,
    },
  )
}

// callback Event
// popup_id, match_time_slot, match_id, display_admin
export const ReloadSingleRow = async payload => {
  const queryKey = ['mo5', payload.popup_id, payload.match_time_slot]

  const newData = await apiClient
    .get('/mo5/single', {
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
        const index = draftState.findIndex(x => x.ArrMatch.row_id === newData.ArrMatch.row_id)
        draftState[index] = newData
      }),
    )
  } else queryClient.invalidateQueries(queryKey)
}

// popup_id, match_time_slot, match_id
export const ReloadPartaiRow = async payload => {
  const queryKey = ['mo5', payload.popup_id, payload.match_time_slot]

  const newData = await apiClient
    .get('/mo5/partai', {
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

export default { QueryMO5 }
