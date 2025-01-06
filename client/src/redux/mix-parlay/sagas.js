import { all, call, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/mix-parlay'
import actions from './actions'

export function* UPDATE_ON_OFF_MATCH_PARLAY({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateOnOffMatchParlay, payload, source)
  if (response) {
    successCallback()
  }
}

export function* UPDATE_ON_OFF_SUB_MATCH_PARLAY({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateOnOffSubMatchParlay, payload, source)
  if (response) {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLeading(actions.UPDATE_ON_OFF_MATCH_PARLAY, UPDATE_ON_OFF_MATCH_PARLAY),
    takeLeading(actions.UPDATE_ON_OFF_SUB_MATCH_PARLAY, UPDATE_ON_OFF_SUB_MATCH_PARLAY),
  ])
}
