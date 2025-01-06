import { all, put, call, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/member-login'
import actions from './actions'

export function* LOAD_TABLE({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.LoadTable, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
}

export default function* rootSaga() {
  yield all([takeLatest(actions.LOAD_TABLE, LOAD_TABLE)])
}
