import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/list-payout-info'
import actions from './actions'

export function* LOAD_PAYOUT_INFO({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.LoadPayoutInfo, payload, source)
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

export function* UPDATE_LIST_PAYOUT_INFO({ payload, successCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.UpdateListPayoutInfo, payload, source)
  if (response) {
    yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_PAYOUT_INFO, LOAD_PAYOUT_INFO),
    takeLeading(actions.UPDATE_LIST_PAYOUT_INFO, UPDATE_LIST_PAYOUT_INFO),
  ])
}
