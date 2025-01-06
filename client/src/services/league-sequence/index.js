import apiClient from 'services/axios'

export async function Load(payload, source) {
  return apiClient
    .get(`/league-sequence`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadSpecial(payload, source) {
  return apiClient
    .get(`/league-sequence/special`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Swap(payload, source) {
  return apiClient
    .put(`/league-sequence/swap`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function SwapSpecial(payload, source) {
  return apiClient
    .put(`/league-sequence/swap-special`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Load
