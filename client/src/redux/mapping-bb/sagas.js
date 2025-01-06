import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/mapping-bb'
import actions from './actions'

export function* LOAD_TABLE({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.LoadTable, payload, source)
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
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.Update, payload, source)
  if (response) {
    yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([takeLatest(actions.LOAD_TABLE, LOAD_TABLE), takeLeading(actions.UPDATE, UPDATE)])
}
