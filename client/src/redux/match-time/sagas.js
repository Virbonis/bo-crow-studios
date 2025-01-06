import { all, call, put, takeEvery, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/match-time'
import actions from './actions'

export function* LOAD_DATA({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.Load, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export function* UPDATE_AUTO_CLOSE({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateAutoClose, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}

export function* UPDATE_AUTO_TIMER({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateAutoTimer, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}

export function* UPDATE_MATCH_TIME({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateMatchTime, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOAD_DATA, LOAD_DATA),
    takeLeading(actions.UPDATE_AUTO_CLOSE, UPDATE_AUTO_CLOSE),
    takeLeading(actions.UPDATE_AUTO_TIMER, UPDATE_AUTO_TIMER),
    takeLeading(actions.UPDATE_MATCH_TIME, UPDATE_MATCH_TIME),
  ])
}
