import apiClient from 'services/axios'

export async function GetBetInfoBTi(payload, source) {
  return apiClient
    .get('/bti-bet-info', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default GetBetInfoBTi
