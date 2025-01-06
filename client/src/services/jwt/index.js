import apiClient from 'services/axios'
import store from 'store'
import { notification } from 'antd'

export async function login(payload, source) {
  return apiClient
    .post('/auth/login', payload, {
      headers: {
        source,
      },
    })
    .then(response => {
      if (response) {
        const { data } = response.data
        if (data) {
          store.set('accessToken', data)
          store.set('username', payload.username)
        }
        return data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function register(email, password, name) {
  return apiClient
    .post('/auth/register', {
      email,
      password,
      name,
    })
    .then(response => {
      if (response) {
        const { accessToken } = response.data
        if (accessToken) {
          store.set('accessToken', accessToken)
        }
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function currentAccount(source) {
  return apiClient
    .get('/auth/account', {
      headers: {
        source,
      },
    })
    .then(response => {
      if (response) {
        const { accessToken } = response.data
        if (accessToken) {
          store.set('accessToken', accessToken)
        }
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function update(payload, source) {
  return apiClient
    .put('/auth/account', payload, {
      headers: {
        source,
      },
    })
    .then(response => {
      if (response) {
        const { data } = response.data
        if (data) {
          store.set('accessToken', data)
          notification.info({
            message: 'User Profile has been updated.',
          })
        }
        return data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function logout(source) {
  return apiClient
    .get('/auth/logout', {
      headers: {
        source,
      },
    })
    .then(() => {
      store.remove('accessToken')
      return true
    })
    .catch(err => console.log(err))
}
