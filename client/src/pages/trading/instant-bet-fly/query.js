import { getStatusAcRj } from 'helper'
import { useQuery } from 'react-query'
import apiClient from 'services/axios'
// import { data_A, data_B } from './dummy'

// let i = 0
export const QueryInstantBet = payload => {
  const { shown_columns, ...params } = payload
  return useQuery(
    ['instantbet', params],
    () =>
      apiClient
        .get('/instantbet', {
          params,
        })
        .then(response => {
          return convertDataArray(response?.data?.data)
          // const randomNumber = Math.floor(Math.random() * 2)
          // i += 1
          // if (i % 2 === 0) return convertDataArray(data_A)
          // return convertDataArray(data_B)
        }),
    {
      enabled: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchInterval: payload.interval * 1000 || false,
      refetchIntervalInBackground: true,
      cacheTime: 1, // disable cache
    },
  )
}

const convertDataArray = array => {
  return array.map(x => ({
    ...x,
    prefixUsername: x.sign_up_week === 0 ? '+ ' : '',
    // vip_code: x.vip_code?.split('^')[0],
    // vipColorClass: getVIPColorClass(x.vip_code),
    branchColorClass: x.comp_type !== 'H' && x.comp_type !== 'B' ? 'text-blue' : '',
    statusBet: getStatusAcRj(x.status, x.void_id, x.early_counter, x.ev_round),
  }))
}

export default { QueryInstantBet }
