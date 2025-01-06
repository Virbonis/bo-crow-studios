import { all, put, call, takeLeading, takeEvery } from 'redux-saga/effects'
import * as svc from 'services/breakdown-patching'
import actions from './actions'

export function* LOAD({ payload, source, isCopy }) {
  const loadingKey = !isCopy ? 'loading' : 'loading_copy'
  const dataKey = !isCopy ? 'data' : 'data_copy'

  yield put({ type: actions.SET_STATE, payload: { [loadingKey]: true } })
  const response = yield call(svc.LoadSummaryTraderDeadBallCopy, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        [dataKey]: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { [loadingKey]: false } })
}

export function* UPDATE({ payload, source }) {
  // const { match_id, match_id_copy } = payload
  // yield all([
  //   call(LOAD, { payload: { match_id }, source, isCopy: false }),
  //   call(LOAD, { payload: { match_id: match_id_copy }, source, isCopy: true }),
  // ])

  yield call(svc.UpdateTraderDeadBallCopy, payload, source)
}

export default function* rootSaga() {
  yield all([takeEvery(actions.LOAD, LOAD), takeLeading(actions.UPDATE, UPDATE)])
}
