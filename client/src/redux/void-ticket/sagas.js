import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/void-ticket'
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

export function* UPDATE({ payload, source, successCallback }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.Update, payload, source)
  if (response) {
    successCallback()
  }
  yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
}

export default function* rootSaga() {
  yield all([takeLatest(actions.LOAD, LOAD), takeLeading(actions.UPDATE, UPDATE)])
}
