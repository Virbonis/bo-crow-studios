import { all, put, call, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/mapping-lottery'
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

export function* COPY_TO_LOTTERY({ payload, successCallback, source }) {
  const response = yield call(svc.CopyToLottery, payload, source)
  if (response) {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([takeLatest(actions.LOAD, LOAD), takeLatest(actions.COPY_TO_LOTTERY, COPY_TO_LOTTERY)])
}
