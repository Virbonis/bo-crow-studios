import { all, call, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/mo5'
import actions from './actions'

export function* UPDATE_LEECH_ASSIGN({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateLeechAssign, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}
export function* UPDATE_PAUSE_RESUME_ALL({ payload, successCallback, source }) {
  const response = yield call(svc.PauseResumeAll, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLeading(actions.UPDATE_LEECH_ASSIGN, UPDATE_LEECH_ASSIGN),
    takeLeading(actions.UPDATE_PAUSE_RESUME_ALL, UPDATE_PAUSE_RESUME_ALL),
  ])
}
