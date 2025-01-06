import { all, put, call, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/shareholder-buyback'
import actions from './actions'

export function* CREATE({ payload, successCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.Create, payload, source)
  if (response) {
    yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([takeLeading(actions.CREATE, CREATE)])
}
