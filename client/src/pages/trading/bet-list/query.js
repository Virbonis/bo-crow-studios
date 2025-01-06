import { listGT } from 'helper'
import { useQuery } from 'react-query'
import apiClient from 'services/axios'

const QueryBetList = payload => {
  const params = payload
  return useQuery(
    ['betlist', params],
    () =>
      apiClient.get('/betlist', { params }).then(response => {
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
const QueryBetListCS = payload => {
  const params = payload
  return useQuery(
    ['betlist', params],
    () =>
      apiClient.get('/betlistcs', { params }).then(response => {
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

const getListGameType = (paramListGT, defaultListGameType) => {
  if (paramListGT.length === 0) paramListGT = defaultListGameType
  const mapGT = {
    AHSW: listGT.AHSW,
    GAH: listGT.GAH,
    OUGOU: listGT.OUGOU,
    OEGOE: listGT.OEGOE,
    ML: listGT.ML,
    NGNC: listGT.NGNC,
    '1X2': listGT['1X2'],
  }
  return paramListGT.flatMap(gt => mapGT[gt]).join(',')
}

export { QueryBetList, QueryBetListCS, getListGameType }
