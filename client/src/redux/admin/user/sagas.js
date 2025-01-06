import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/admin/user'
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

export function* CREATE({ payload, successCallback, source }) {
  const response = yield call(svc.Create, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}

export function* UPDATE({ payload, successCallback, source }) {
  const response = yield call(svc.Update, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}

export function* DELETE({ payload, successCallback, source }) {
  const response = yield call(svc.Delete, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}

export function* RESET_PASSWORD({ payload, successCallback, source }) {
  const response = yield call(svc.ResetPassword, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}

export function* LOAD_SESSION({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingSession: true } })
  const response = yield call(svc.LoadSession, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        session: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingSession: false } })
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD, LOAD),
    takeLeading(actions.CREATE, CREATE),
    takeLeading(actions.UPDATE, UPDATE),
    takeLeading(actions.DELETE, DELETE),
    takeLeading(actions.RESET_PASSWORD, RESET_PASSWORD),
    takeLatest(actions.LOAD_SESSION, LOAD_SESSION),
  ])
}
