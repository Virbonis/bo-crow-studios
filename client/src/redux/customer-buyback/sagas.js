import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/customer-buyback'
import actions from './actions'

export function* LOAD_CUSTOMER_BUYBACK({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.LoadCustomerBuyback, payload, source)
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

export function* LOAD_SELECT_CUSTOMER_UPLINE({ source }) {
  const response = yield call(svc.LoadSelectCustomerUpline, source)
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

export function* UPDATE_CUSTOMER_BUYBACK({ payload, successCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.UpdateCustomerBuyback, payload, source)
  if (response) {
    yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
    successCallback()
  }
}

export function* CREATE_CUSTOMER_BUYBACK({ payload, successCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.CreateCustomerBuyback, payload, source)
  if (response) {
    yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_CUSTOMER_BUYBACK, LOAD_CUSTOMER_BUYBACK),
    takeLatest(actions.LOAD_SELECT_CUSTOMER_UPLINE, LOAD_SELECT_CUSTOMER_UPLINE),
    takeLeading(actions.UPDATE_CUSTOMER_BUYBACK, UPDATE_CUSTOMER_BUYBACK),
    takeLeading(actions.CREATE_CUSTOMER_BUYBACK, CREATE_CUSTOMER_BUYBACK),
  ])
}
