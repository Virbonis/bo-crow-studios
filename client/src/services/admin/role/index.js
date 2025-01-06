import { notification } from 'antd'
import apiClient from 'services/axios'

export async function Load(source) {
  return apiClient
    .get('/role', { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Create(payload, source) {
  return apiClient
    .post('/role', payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Role has been created.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Update(payload, source) {
  return apiClient
    .put(`/role/${payload.role_id}`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Role has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Delete(payload, source) {
  return apiClient
    .delete(`/role/${payload.role_id}`, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Role has been deleted.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function GetUser(id, source) {
  return apiClient
    .get(`role/${id}/user`, { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateUser({ id, data }, source) {
  return apiClient
    .put(`role/${id}/user`, data, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Role user has been successfully updated.',
          })
          return true
        }
        notification.error({
          message: 'Failed to update role user',
        })
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function GetMenu(id, source) {
  return apiClient
    .get(`role/${id}/menu`, { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateMenu({ id, data }, source) {
  return apiClient
    .put(`role/${id}/menu`, data, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Role menu has been successfully updated.',
          })
          return true
        }
        notification.error({
          message: 'Failed to update role menu',
        })
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function GetPermission(id, source) {
  return apiClient
    .get(`role/${id}/permission`, { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdatePermission({ id, data }, source) {
  return apiClient
    .put(`role/${id}/permission`, data, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Role permission has been successfully updated.',
          })
          return true
        }
        notification.error({
          message: 'Failed to update role permission',
        })
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Load
