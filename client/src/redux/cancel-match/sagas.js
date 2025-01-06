import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/cancel-match'
import actions from './actions'

export function* LOAD({ payload, source }) {
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

export function* UPDATE({ payload, successCallback, source }) {
  const response = yield call(svc.Update, payload, source)
  if (response) {
    successCallback()
  }
}

export function* LOAD_SPECIAL({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingSpecialData: true } })
  const response = yield call(svc.LoadDataSpecial, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        specialData: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingSpecialData: false } })
}

export function* UPDATE_SPECIAL({ payload, successCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingSpecialData: true } })
  const response = yield call(svc.UpdateSpecial, payload, source)
  if (response) {
    yield put({ type: actions.SET_STATE, payload: { loadingSpecialData: false } })
    successCallback()
  }
}
export function* UPDATE_SPECIAL_BASKET({ payload, successCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingSpecialData: true } })
  const response = yield call(svc.UpdateSpecialBasket, payload, source)
  if (response) {
    yield put({ type: actions.SET_STATE, payload: { loadingSpecialData: false } })
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD, LOAD),
    takeLatest(actions.LOAD_SPECIAL, LOAD_SPECIAL),
    takeLeading(actions.UPDATE, UPDATE),
    takeLeading(actions.UPDATE_SPECIAL, UPDATE_SPECIAL),
    takeLeading(actions.UPDATE_SPECIAL_BASKET, UPDATE_SPECIAL_BASKET),
  ])
}
