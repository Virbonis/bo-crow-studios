import { all, takeEvery, put, call, select, takeLeading } from 'redux-saga/effects'
import { notification } from 'antd'
import { history } from 'index'
import * as jwt from 'services/jwt'
import loadGlobal from 'redux/preload-state'
import actions from './actions'

const mapAuthProviders = {
  jwt: {
    login: jwt.login,
    register: jwt.register,
    currentAccount: jwt.currentAccount,
    logout: jwt.logout,
    update: jwt.update,
  },
}

export function* LOGIN({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })

  const { authProvider: autProviderName } = yield select(state => state.auth.settings)
  const success = yield call(mapAuthProviders[autProviderName].login, payload, source)
  if (success) {
    yield put({
      type: actions.LOAD_CURRENT_ACCOUNT,
    })
    yield history.push('/')
    notification.success({
      message: 'Logged In',
      description: 'You have successfully logged in!',
    })
  }
  if (!success) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
      },
    })
  }
}

export function* LOAD_CURRENT_ACCOUNT({ source }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
    },
  })
  const { authProvider } = yield select(state => state.auth.settings)
  const response = yield call(mapAuthProviders[authProvider].currentAccount, source)
  if (response) {
    const {
      id,
      email,
      name,
      avatar,
      roles,
      role_ids,
      last_login,
      trader_group_ori,
      user_auth_ids,
    } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        id,
        name,
        email,
        avatar,
        roles: roles ? roles.split(',') : [],
        // eslint-disable-next-line camelcase
        role_ids: role_ids ? role_ids.split(',') : [],
        authorized: true,
        // eslint-disable-next-line camelcase
        last_login,
        trader_group_ori,
        user_auth_ids: user_auth_ids.map(x => x.auth_id),
      },
    })
    yield loadGlobal()
  }
  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: false,
    },
  })
}

export function* LOGOUT({ source }) {
  const { authProvider } = yield select(state => state.auth.settings)
  yield call(mapAuthProviders[authProvider].logout, source)
  yield put({
    type: actions.SET_STATE,
    payload: {
      id: '',
      name: '',
      role: '',
      email: '',
      avatar: '',
      authorized: false,
      loading: false,
    },
  })
  // remove tabs on logout
  yield put({ type: 'auth/settings/SET_STATE', payload: { tabs: [] } })
}

export function* UPDATE({ payload, successCallback, source }) {
  const { authProvider: autProviderName } = yield select(state => state.auth.settings)
  const response = yield call(mapAuthProviders[autProviderName].update, payload, source)
  if (response) {
    yield put({
      type: actions.LOAD_CURRENT_ACCOUNT,
    })
    if (typeof successCallback === 'function' && successCallback !== undefined) {
      successCallback()
    }
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOGIN, LOGIN),
    takeEvery(actions.LOAD_CURRENT_ACCOUNT, LOAD_CURRENT_ACCOUNT),
    takeEvery(actions.LOGOUT, LOGOUT),
    takeLeading(actions.UPDATE, UPDATE),
    LOAD_CURRENT_ACCOUNT({ source: 'ONLOAD' }), // run once on app load to check user auth
  ])
}
