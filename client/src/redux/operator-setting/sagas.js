import { all, put, call, takeLeading, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/operator-setting'
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
  const response = yield call(svc.UpdateSetting, payload, source)
  if (response && successCallback && typeof successCallback === 'function') {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([takeLatest(actions.LOAD, LOAD), takeLeading(actions.UPDATE, UPDATE)])
}
