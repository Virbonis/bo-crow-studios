import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/edit-sub-match-setting'
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
export function* UPDATE({ payload, successCallback, source }) {
  const response = yield call(svc.Update, payload, source)
  if (response) {
    successCallback()
  }
}

export function* LOAD_OUTRIGHT({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadOutrightSetting, payload, source)
  if (response) {
    const { data } = response

    yield put({
      type: actions.SET_STATE,
      payload: { data },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}
export function* UPDATE_OUTRIGHT({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateOutrightSetting, payload, source)
  if (response) {
    successCallback()
  }
}

export function* LOAD_SPECIAL({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadSpecial, payload, source)
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
export function* UPDATE_SPECIAL({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateSpecial, payload, source)
  if (response) {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD, LOAD),
    takeLeading(actions.UPDATE, UPDATE),
    takeLatest(actions.LOAD_OUTRIGHT, LOAD_OUTRIGHT),
    takeLeading(actions.UPDATE_OUTRIGHT, UPDATE_OUTRIGHT),
    takeLatest(actions.LOAD_SPECIAL, LOAD_SPECIAL),
    takeLeading(actions.UPDATE_SPECIAL, UPDATE_SPECIAL),
  ])
}
