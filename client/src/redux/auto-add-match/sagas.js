import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/auto-add-match'
import actions from './actions'

export function* LOAD({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadData, payload, source)
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
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export function* ADD_MATCH({ payload, successCallback, source }) {
  const response = yield call(svc.AddData, payload, source)
  if (response) {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([takeLatest(actions.LOAD, LOAD), takeLeading(actions.ADD_MATCH, ADD_MATCH)])
}
