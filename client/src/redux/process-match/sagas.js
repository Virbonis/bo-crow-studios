import { all, put, call, takeLatest, takeLeading, takeEvery } from 'redux-saga/effects'
import * as svc from 'services/process-match'
import actions from './actions'

export function* LOAD({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.LoadProcessMatch, payload, source)
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
export function* PROCESS_MATCH({ payload, successCallback, source }) {
  const response = yield call(svc.ProcessMatch, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}
export function* DELETE_QUEUE({ payload, successCallback, source }) {
  const response = yield call(svc.DeleteQueueProcessMatch, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}

export function* LOAD_SPECIAL({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingSpecial: true } })
  const response = yield call(svc.LoadProcessMatchSpecial, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        dataSpecial: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingSpecial: false } })
}
export function* PROCESS_MATCH_SPECIAL({ payload, successCallback, source }) {
  const response = yield call(svc.ProcessMatchSpecial, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD, LOAD),
    takeLatest(actions.LOAD_SPECIAL, LOAD_SPECIAL),
    takeLeading(actions.PROCESS_MATCH, PROCESS_MATCH),
    takeLeading(actions.PROCESS_MATCH_SPECIAL, PROCESS_MATCH_SPECIAL),
    takeEvery(actions.DELETE_QUEUE, DELETE_QUEUE),
  ])
}
