import { all, put, call, takeLatest } from 'redux-saga/effects'
import { RetryPreload } from 'redux/preload-state'
import * as svc from 'services/special-code'
import actions from './actions'

export function* PRELOAD({ source }) {
  const response = yield RetryPreload(svc.LoadSelect, source)
  if (response) {
    const { status, data } = response
    // remove data array 0
    data.shift()
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        select: data,
      },
    })
  }
}
export function* LOAD_BY_SPORT({ payload, source }) {
  const response = yield call(svc.LoadBySport, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        select_by_sport: data,
      },
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.PRELOAD, PRELOAD),
    takeLatest(actions.LOAD_BY_SPORT, LOAD_BY_SPORT),
  ])
}
