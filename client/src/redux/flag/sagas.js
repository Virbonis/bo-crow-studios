import { all, call, put, takeLatest, takeLeading } from 'redux-saga/effects'
import { RetryPreload } from 'redux/preload-state'
import * as svc from 'services/flag'
import actions from './actions'

export function* PRELOAD({ source }) {
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
}

export function* LOAD({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadFlag, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        data,
        status,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export function* ADD_FLAG({ payload, successCallback, source }) {
  const resonse = yield call(svc.AddFlag, payload, source)
  if (resonse) {
    successCallback()
  }
}
export function* CHANGE_FLAG({ payload, successCallback, source }) {
  const resonse = yield call(svc.UpdateFlag, payload, source)
  if (resonse) {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([takeLatest(actions.PRELOAD, PRELOAD)])
  yield all([takeLatest(actions.LOAD, LOAD)])
  yield all([takeLeading(actions.ADD_FLAG, ADD_FLAG)])
  yield all([takeLeading(actions.CHANGE_FLAG, CHANGE_FLAG)])
}
