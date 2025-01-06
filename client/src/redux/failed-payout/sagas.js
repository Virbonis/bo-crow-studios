import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/failed-payout'
import actions from './actions'

export function* LOAD({ source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.Load, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export function* RESET({ payload, successCallback, source }) {
  const response = yield call(svc.Reset, payload, source)
  if (response) {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([takeLatest(actions.LOAD, LOAD), takeLeading(actions.RESET, RESET)])
}
