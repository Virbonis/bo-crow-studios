import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/standings'
import actions from './actions'

export function* LOAD_CATEGORY({ source }) {
  const response = yield call(svc.LoadCategory, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        dataCategory: data,
      },
    })
  }
}

export function* LOAD({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
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
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export function* CREATE({ payload, successCallback, source }) {
  const response = yield call(svc.Create, payload, source)
  if (response) {
    successCallback()
  }
}
export function* UPDATE({ payload, successCallback, source }) {
  const response = yield call(svc.Update, payload, source)
  if (response) {
    successCallback()
  }
}
export function* DELETE({ payload, successCallback, source }) {
  const response = yield call(svc.Delete, payload, source)
  if (response) {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_CATEGORY, LOAD_CATEGORY),
    takeLatest(actions.LOAD, LOAD),
    takeLatest(actions.CREATE, CREATE),
    takeLeading(actions.UPDATE, UPDATE),
    takeLatest(actions.DELETE, DELETE),
  ])
}
