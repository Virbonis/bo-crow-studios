import { all, call, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/force-logout-player-session'
import actions from './actions'

export function* UPDATE({ payload, source }) {
  yield call(svc.Update, payload, source)
}

export default function* rootSaga() {
  yield all([takeLeading(actions.UPDATE, UPDATE)])
}
