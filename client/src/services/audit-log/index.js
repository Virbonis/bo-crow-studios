import apiClient from 'services/axios'

export async function Load(payload) {
  return apiClient
    .get('/auditlog', { params: payload })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Create(payload, { source, task }) {
  return (
    apiClient
      .post('/auditlog', payload, { headers: { source, task } })
      // .then(response => {
      //   if (response) {
      //   }
      //   return false
      // })
      .catch(err => console.log(err))
  )
}

export default Load
