import { all, put, call, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/bti-payout-tracker'
import actions from './actions'

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

export default function* rootSaga() {
  yield all([takeLatest(actions.LOAD, LOAD)])
}
