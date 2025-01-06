import { all, put, takeLatest } from 'redux-saga/effects'
import { RetryPreload } from 'redux/preload-state'
import * as svc from 'services/general'
import actions from './actions'

export function* PRELOAD({ source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield RetryPreload(svc.LoadSelect, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        select: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
}
export default function* rootSaga() {
  yield all([takeLatest(actions.PRELOAD, PRELOAD)])
}
