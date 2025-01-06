import apiClient from 'services/axios'
import { notification } from 'antd'

export async function Load(payload, source) {
  return apiClient
    .get('/match-statistic', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Update(payload, source) {
  return apiClient
    .put('/match-statistic', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Match Statistic has been Updated.',
        })
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Load
