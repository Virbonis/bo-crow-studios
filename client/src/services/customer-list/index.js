import apiClient from 'services/axios'
import { notification } from 'antd'

export async function LoadCustomerList(payload, source) {
  return apiClient
    .get('/customer/list', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function ExportCustomerList(payload, source) {
  return apiClient
    .get('/customer/export', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateResetPasswordCustomer(payload, source) {
  return apiClient
    .put('/customer/list/password', payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Customer password has been changed.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadEditCustomer(payload, source) {
  return apiClient
    .get('/customer/edit', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
// skipped
export async function LoadUplineCustomer(payload, source) {
  return apiClient
    .get('/customer/list/upline', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateEditCustomer(payload, source) {
  return apiClient
    .put('/customer/edit', payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Customer has been updated',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadLimitProfile(payload, source) {
  return apiClient
    .get('/customer/limit-profile', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadCustomerBetLimit(payload, source) {
  return apiClient
    .get('/customer/edit-bet-limit', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadCustomerBetLimitBySport(payload, source) {
  return apiClient
    .get('/customer/edit-bet-limit/sport', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateCustomerBetLimit(payload, source) {
  return apiClient
    .put('/customer/edit-bet-limit', payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Customer Bet Limit has been Updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateCustomerBetLimitBySport(payload, source) {
  return apiClient
    .put('/customer/edit-bet-limit/sport', payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Customer Bet Limit has been Updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadBetLimitLog(payload, source) {
  return apiClient
    .get('/customer/list/bet-limit-log', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadVIPLog(payload, source) {
  return apiClient
    .get('/customer/list/vip-log', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadCustomerDelayBet(payload, source) {
  return apiClient
    .get('/customer/list/delay-bet', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateCustomerDelayBet(payload, source) {
  return apiClient
    .put('/customer/list/delay-bet', payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Customer Delay Bet has been Updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadCustomerList
