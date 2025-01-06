import { all, call, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/bti-process-breakdown-report'
import actions from './actions'

export function* PROCESS({ payload, successCallback, source }) {
  const response = yield call(svc.Process, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([takeLeading(actions.PROCESS, PROCESS)])
}
