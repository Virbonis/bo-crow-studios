import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/league-group'
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

export function* DELETE({ payload, successCallback, source }) {
  const response = yield call(svc.Delete, payload, source)
  if (response) {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD, LOAD),
    takeLeading(actions.CREATE, CREATE),
    takeLeading(actions.DELETE, DELETE),
  ])
}
