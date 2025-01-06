import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/cash-limit-profile'
import actions from './actions'

export function* LOAD({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.Load, payload, source)
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
  yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
}
export function* CREATE({ payload, successCallback, source }) {
  const response = yield call(svc.Create, payload, source)
  if (response) {
    successCallback()
  }
}
export function* DELETE({ payload, source, successCallback }) {
  const response = yield call(svc.Delete, payload, source)
  if (response) {
    successCallback()
  }
}
export function* LOAD_LOG({ payload, source }) {
  const response = yield call(svc.LoadLog, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        dataLog: data,
      },
    })
  }
}

export function* LOAD_DETAIL({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingEdit: true } })
  const response = yield call(svc.LoadDetail, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        dataEdit: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingEdit: false } })
}
export function* CREATE_DETAIL({ payload, successCallback, source }) {
  const response = yield call(svc.CreateDetail, payload, source)
  if (response) {
    successCallback()
  }
}
export function* DELETE_DETAIL({ payload, successCallback, source }) {
  const response = yield call(svc.DeleteDetail, payload, source)
  if (response) {
    successCallback()
  }
}
export function* UPDATE_DETAIL({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateDetail, payload, source)
  if (response) {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD, LOAD),
    takeLeading(actions.CREATE, CREATE),
    takeLeading(actions.DELETE, DELETE),
    takeLatest(actions.LOAD_LOG, LOAD_LOG),
    takeLatest(actions.LOAD_DETAIL, LOAD_DETAIL),
    takeLeading(actions.CREATE_DETAIL, CREATE_DETAIL),
    takeLeading(actions.DELETE_DETAIL, DELETE_DETAIL),
    takeLeading(actions.UPDATE_DETAIL, UPDATE_DETAIL),
  ])
}
