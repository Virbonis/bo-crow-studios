import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/admin/role'
import actions from './actions'

export function* LOAD({ source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.Load, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export function* CREATE({ payload, successCallback, source }) {
  const response = yield call(svc.Create, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}

export function* UPDATE({ payload, successCallback, source }) {
  const response = yield call(svc.Update, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}

export function* DELETE({ payload, successCallback, source }) {
  const response = yield call(svc.Delete, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}

function* GET_USER({ payload, source }) {
  const response = yield call(svc.GetUser, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        user: data,
      },
    })
  }
}
function* UPDATE_USER({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateUser, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}

function* GET_MENU({ payload, source }) {
  const response = yield call(svc.GetMenu, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        menu: data,
      },
    })
  }
}
function* UPDATE_MENU({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateMenu, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}

function* GET_PERMISSION({ payload, source }) {
  const response = yield call(svc.GetPermission, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        permission: data,
      },
    })
  }
}
function* UPDATE_PERMISSION({ payload, successCallback, source }) {
  const response = yield call(svc.UpdatePermission, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD, LOAD),
    takeLeading(actions.CREATE, CREATE),
    takeLeading(actions.UPDATE, UPDATE),
    takeLeading(actions.DELETE, DELETE),
    takeLatest(actions.GET_USER, GET_USER),
    takeLeading(actions.UPDATE_USER, UPDATE_USER),
    takeLatest(actions.GET_MENU, GET_MENU),
    takeLeading(actions.UPDATE_MENU, UPDATE_MENU),
    takeLatest(actions.GET_PERMISSION, GET_PERMISSION),
    takeLeading(actions.UPDATE_PERMISSION, UPDATE_PERMISSION),
  ])
}
