import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import { RetryPreload } from 'redux/preload-state'
import * as svc from 'services/sport'
import actions from './actions'

export function* PRELOAD({ source }) {
  const response = yield RetryPreload(svc.LoadSelect, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        select: data,
      },
    })
  }
}

export function* LOAD({ source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.Load, source)
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

export function* LOAD_SORTING({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadSorting, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        dataSorting: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export function* UPDATE_SORTING({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateSorting, payload, source)
  if (response) {
    successCallback()
  }
}

export function* UPDATE({ payload, successCallback, source }) {
  const response = yield call(svc.Update, payload, source)
  if (response) {
    successCallback()
  }
}

export function* COPY_SORTING({ payload, successCallback, source }) {
  const response = yield call(svc.CopySorting, payload, source)
  if (response) {
    successCallback()
  }
}

export function* LOAD_DELAY_BET({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingDelayBet: true } })
  const response = yield call(svc.LoadDelayBet, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        dataDelayBet: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingDelayBet: false } })
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.PRELOAD, PRELOAD),
    takeLatest(actions.LOAD, LOAD),
    takeLatest(actions.LOAD_SORTING, LOAD_SORTING),
    takeLeading(actions.UPDATE, UPDATE),
    takeLeading(actions.UPDATE_SORTING, UPDATE_SORTING),
    takeLeading(actions.COPY_SORTING, COPY_SORTING),
    takeLeading(actions.LOAD_DELAY_BET, LOAD_DELAY_BET),
  ])
}
