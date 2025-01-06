import apiClient from 'services/axios'

export async function LoadSelect(source) {
  return apiClient
    .get('/general/buy-from', { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function GetDateTimeDBServer(payload, source) {
  return apiClient
    .get(`/general/datetime/server`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function GetDateTimeBusinessHour(payload, source) {
  return apiClient
    .get(`/general/datetime/businesshour`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function GetLastGLDate(payload, source) {
  return apiClient
    .get(`/general/datetime/lastgldate`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function GetLastMemberTrackerDate(payload, source) {
  return apiClient
    .get(`/general/datetime/lastmembertrackerdate`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function GetDateTimeGLDate(payload, source) {
  return apiClient
    .get(`/general/datetime/gldate`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export default GetDateTimeBusinessHour
