import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadTable(payload, source) {
  return apiClient
    .get('/bet-enquiry', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadTableParlay(payload, source) {
  return apiClient
    .get('/bet-enquiry/parlay', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadTableLottery(payload, source) {
  return apiClient
    .get('/bet-enquiry/lottery', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadTableResult(payload, source) {
  return apiClient
    .get('/bet-enquiry/result', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function GetTableResultBetBuilder(payload, source) {
  return apiClient
    .get('/bet-enquiry/result-bet-builder', { params: payload, headers: { source } })
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
    .put(`/bet-enquiry`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Bet Enquiry has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadTable
