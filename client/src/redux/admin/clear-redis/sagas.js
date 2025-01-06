import { all, put, call, takeLatest, takeEvery } from 'redux-saga/effects'
import * as svc from 'services/admin/clear-redis'
import actions from './actions'

export function* LOAD({ source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.Load, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        data: data.map(x => ({ redis_key: x })),
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export function* CLEAR_REDIS({ payload, successCallback, source }) {
  const { redis_key } = payload
  yield put({ type: actions.UPDATE_STATE, payload: { redis_key, status: 'loading' } })

  const response = yield call(svc.ClearRedis, payload, source)
  if (typeof successCallback === 'function') successCallback()

  let status = 'error'
  if (response === 0) status = 'nothing to delete'
  else if (response === 1) status = 'success'

  yield put({
    type: actions.UPDATE_STATE,
    payload: { redis_key, status },
  })
}

export default function* rootSaga() {
  yield all([takeLatest(actions.LOAD, LOAD), takeEvery(actions.CLEAR_REDIS, CLEAR_REDIS)])
}
