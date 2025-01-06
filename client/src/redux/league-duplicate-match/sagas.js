import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/league-duplicate-match'
import actions from './actions'

export function* LOAD({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.LoadData, payload, source)
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

export function* SEARCH({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingSearch: true } })
  const response = yield call(svc.Search, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        dataSearch: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingSearch: false } })
}

export function* INSERT({ payload, successCallback, source }) {
  const response = yield call(svc.Insert, payload, source)
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
    takeLatest(actions.LOAD, LOAD),
    takeLatest(actions.SEARCH, SEARCH),
    takeLeading(actions.INSERT, INSERT),
    takeLeading(actions.DELETE, DELETE),
  ])
}
