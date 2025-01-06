import { all, put, call, takeLatest, takeLeading, takeEvery } from 'redux-saga/effects'
import * as svc from 'services/unprocess-outright'
import actions from './actions'

export function* LOAD_DATA({ payload, source }) {
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
export function* UNPROCESS_OUTRIGHT({ payload, successCallback, source }) {
  const response = yield call(svc.UnprocessOutright, payload, source)
  if (response) {
    successCallback()
  }
}
export function* CANCEL_QUEUE({ payload, successCallback, source }) {
  const response = yield call(svc.CancelQueue, payload, source)
  if (response) {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD, LOAD_DATA),
    takeLeading(actions.UNPROCESS_OUTRIGHT, UNPROCESS_OUTRIGHT),
    takeEvery(actions.CANCEL_QUEUE, CANCEL_QUEUE),
  ])
}
