import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/user-login-session'
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

export function* LOAD_POP_UP({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingPopUp: true } })
  const response = yield call(svc.LoadPopUp, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        popUpData: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingPopUp: false } })
}

export function* UPDATE({ payload, successCallback, source }) {
  const response = yield call(svc.Update, payload, source)
  if (response) {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD, LOAD),
    takeLatest(actions.LOAD_POP_UP, LOAD_POP_UP),
    takeLeading(actions.UPDATE, UPDATE),
  ])
}
