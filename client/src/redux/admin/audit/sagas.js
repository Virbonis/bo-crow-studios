import { all, put, call, takeLatest, takeEvery } from 'redux-saga/effects'
import * as svc from 'services/admin/audit'
import actions from './actions'

export function* LOAD_TASK({ payload, source }) {
  const response = yield call(svc.LoadTask, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        select_task: data,
      },
    })
  }
}

export function* LOAD({ payload, source }) {
  const hist = payload.hist ? '_Hist' : ''
  yield put({ type: actions.SET_STATE, payload: { [`loading${hist}`]: true } })
  const response = yield call(svc.Load, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        [`data${hist}`]: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { [`loading${hist}`]: false } })
}

export default function* rootSaga() {
  yield all([takeEvery(actions.LOAD_TASK, LOAD_TASK), takeLatest(actions.LOAD, LOAD)])
}
