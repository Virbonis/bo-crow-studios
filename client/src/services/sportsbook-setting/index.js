import { notification } from 'antd'
import apiClient from 'services/axios'

export async function Load() {
  return apiClient
    .get('/sportsbook-setting')
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadDefaultMatchOutright() {
  return apiClient
    .get('/sportsbook-setting/default-match-outright')
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateSportsbookSetting(payload, source) {
  return apiClient
    .put('/sportsbook-setting', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Sportsbook Setting has been updated',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateDefaultMatchOutright(payload, source) {
  return apiClient
    .put('/sportsbook-setting/default-match-outright', payload, {
      headers: { source },
    })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Switch Default has been updated',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateMaintenanceStatus(payload, source) {
  return apiClient
    .put('/sportsbook-setting/status/maintenance', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Maintenance Status has been updated',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateSeamlessMaintenanceStatus(payload, source) {
  return apiClient
    .put('/sportsbook-setting/status/seamless-maintenance', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Seamless Maintenance Status has been updated',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateCloseFundTransferStatus(payload, source) {
  return apiClient
    .put('/sportsbook-setting/status/close-fund-transfer', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Close Fund Transfer Status has been updated',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateBetBazarStatus(payload, source) {
  return apiClient
    .put('/sportsbook-setting/status/bet-bazar', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'BetBazar Status has been updated',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateIMStatus(payload, source) {
  return apiClient
    .put('/sportsbook-setting/status/im', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'IM Status has been updated',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateSISStatus(payload, source) {
  return apiClient
    .put('/sportsbook-setting/status/sis', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'SIS Status has been updated',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateBTIAutoAddMatch(payload, source) {
  return apiClient
    .put('/sportsbook-setting/status/bti-auto-add-match', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'BTI Auto Add Match Status has been updated',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Load
