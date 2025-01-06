import { all, put, call, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/match-record'
import actions from './actions'

export function* UPDATE_GOAL({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateGoal, payload, source)
  if (response) {
    successCallback()
    yield put({ type: actions.UPDATE_STATE, payload })
  }
}

export function* UPDATE_CARD({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateCard, payload, source)
  if (response) {
    successCallback()
    yield put({ type: actions.UPDATE_STATE, payload })
  }
}

export function* UPDATE_PENALTY({ payload, successCallback, source }) {
  const response = yield call(svc.UpdatePenalty, payload, source)
  if (response) {
    successCallback()
    yield put({ type: actions.UPDATE_STATE, payload })
  }
}

export default function* rootSaga() {
  yield all([
    takeLeading(actions.UPDATE_GOAL, UPDATE_GOAL),
    takeLeading(actions.UPDATE_CARD, UPDATE_CARD),
    takeLeading(actions.UPDATE_PENALTY, UPDATE_PENALTY),
  ])
}
