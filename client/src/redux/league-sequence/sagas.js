import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/league-sequence'
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

export function* LOAD_SPECIAL({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingSpecial: true } })
  const response = yield call(svc.LoadSpecial, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        data_special: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingSpecial: false } })
}

export function* SWAP({ payload, successCallback, source }) {
  const response = yield call(svc.Swap, payload, source)
  if (response) {
    successCallback()
  }
}

export function* SWAP_SPECIAL({ payload, successCallback, source }) {
  const response = yield call(svc.SwapSpecial, payload, source)
  if (response) {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD, LOAD),
    takeLatest(actions.LOAD_SPECIAL, LOAD_SPECIAL),
    takeLeading(actions.SWAP, SWAP),
    takeLeading(actions.SWAP_SPECIAL, SWAP_SPECIAL),
  ])
}
