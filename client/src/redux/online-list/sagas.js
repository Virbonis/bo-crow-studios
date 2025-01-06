import { all, put, call, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/online-list'
import actions from './actions'

export function* LOAD({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.Load, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export function* LOAD_DETAIL({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadDetail, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        dataMulti: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export function* LOAD_BET_DETAIL({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading_bet_detail: true } })

  const response = yield call(svc.BetDetail, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        dataBetDetail: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading_bet_detail: false } })
}
export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD, LOAD),
    takeLatest(actions.LOAD_DETAIL, LOAD_DETAIL),
    takeLatest(actions.LOAD_BET_DETAIL, LOAD_BET_DETAIL),
  ])
}
