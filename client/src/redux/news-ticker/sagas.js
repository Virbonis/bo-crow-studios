import { all, call, put, takeLatest, takeLeading } from 'redux-saga/effects'
import { RetryPreload } from 'redux/preload-state'
import * as svc from 'services/news-ticker'
import actions from './actions'

export function* PRELOAD({ source }) {
  const response = yield RetryPreload(svc.LoadSelect, source)
  if (response) {
    const { data, status } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        select: data,
        status,
      },
    })
  }
}

export function* LOAD_TABLE({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.LoadTable, payload, source)
  if (response) {
    const { data, status } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        data,
        status,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
}

export function* CREATE({ payload, source, successCallback }) {
  const response = yield call(svc.Create, payload, source)
  if (response) {
    successCallback()
  }
}

export function* UPDATE({ payload, source, successCallback }) {
  const response = yield call(svc.Update, payload, source)
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

export default function* rootSaga() {
  yield all([
    takeLatest(actions.PRELOAD, PRELOAD),
    takeLatest(actions.LOAD_TABLE, LOAD_TABLE),
    takeLeading(actions.CREATE, CREATE),
    takeLeading(actions.UPDATE, UPDATE),
    takeLeading(actions.DELETE, DELETE),
  ])
}
