import { all, put, call, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/reset-engine'
import actions from './actions'

export function* RESET_ENGINE({ source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  yield call(svc.ResetEngine, source)
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export default function* rootSaga() {
  yield all([takeLatest(actions.RESET_ENGINE, RESET_ENGINE)])
}
