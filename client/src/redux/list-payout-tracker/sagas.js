import { all, put, call, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/list-payout-tracker'
import actions from './actions'

export function* LOAD_PAYOUT_TRACKER({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadPayoutTracker, payload, source)
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
  yield all([takeLatest(actions.LOAD_PAYOUT_TRACKER, LOAD_PAYOUT_TRACKER)])
}
