import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/operator-detail'
import actions from './actions'

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

export function* UPDATE({ payload, successCallback, source }) {
  const response = yield call(svc.Update, payload, source)
  if (response && successCallback && typeof successCallback === 'function') {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([takeLatest(actions.LOAD, LOAD), takeLeading(actions.UPDATE, UPDATE)])
}
