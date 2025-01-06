import { all, put, takeLatest } from 'redux-saga/effects'
import { RetryPreload } from 'redux/preload-state'
import * as svc from 'services/vip-code'
import actions from './actions'

export function* PRELOAD({ source }) {
  const response = yield RetryPreload(svc.LoadSelect, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        select: data,
      },
    })
  }
}

export default function* rootSaga() {
  yield all([takeLatest(actions.PRELOAD, PRELOAD)])
}
