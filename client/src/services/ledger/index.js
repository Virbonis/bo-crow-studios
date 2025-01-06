import apiClient from 'services/axios'

export async function LoadLedgerMain(payload, source) {
  return apiClient
    .get(`/ledger-main`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadLedgerMainShareholderCash(payload, source) {
  return apiClient
    .get(`/ledger-main/shareholder-cash`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadLedgerMainMember(payload, source) {
  return apiClient
    .get(`/ledger-main/member`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadLedgerAverage(payload, source) {
  return apiClient
    .get(`/ledger-avg`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadLedgerAverageShareholderCash(payload, source) {
  return apiClient
    .get(`/ledger-avg/shareholder-cash`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadLedgerAvgMember(payload, source) {
  return apiClient
    .get(`/ledger-avg/member`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadLedgerNew(payload, source) {
  return apiClient
    .get(`/ledger-new`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadLedgerNewShareholderCash(payload, source) {
  return apiClient
    .get(`/ledger-new/shareholder-cash`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadLedgerNewMember(payload, source) {
  return apiClient
    .get(`/ledger-new/member`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadLedgerBreakdown(payload, source) {
  return apiClient
    .get(`/ledger-breakdown`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadLedgerDetail(payload, source) {
  return apiClient
    .get(`/ledger-detail`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadLedgerMain
