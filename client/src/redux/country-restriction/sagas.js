import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/country-restriction'
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
export function* LOAD_EDIT({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingEdit: true } })
  const response = yield call(svc.LoadEditCountry, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        selectedDataEdit: data.selected,
        dataEdit: data.result,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingEdit: false } })
}

export function* UPDATE({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateEditCountry, payload, source)
  if (response) {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD, LOAD),
    takeLatest(actions.LOAD_EDIT, LOAD_EDIT),
    takeLeading(actions.UPDATE, UPDATE),
  ])
}
