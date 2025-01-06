import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadSelectCustomerUpline(source) {
  return apiClient
    .get('/customer-buyback/upline', { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadCustomerBuyback(payload, source) {
  return apiClient
    .get(`/customer-buyback`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateCustomerBuyback(payload, source) {
  return apiClient
    .put(`/customer-buyback`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Customer Buyback has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function CreateCustomerBuyback(payload, source) {
  return apiClient
    .post(`/customer-buyback`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Customer Buyback has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadCustomerBuyback
