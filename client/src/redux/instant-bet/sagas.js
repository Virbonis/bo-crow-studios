import { all, call, put, takeEvery } from 'redux-saga/effects'
import * as svc from 'services/instant-bet'
import actions from './actions'

export function* LOAD_LIST_PARLAY({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadListParlay, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        listParlay: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}
export function* LOAD_LIST_MATCH_PARLAY({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadListMatchParlay, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        listMatchParlay: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}
export function* LOAD_LIST_LOTTERY({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadListLottery, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        listLottery: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOAD_LIST_PARLAY, LOAD_LIST_PARLAY),
    takeEvery(actions.LOAD_LIST_MATCH_PARLAY, LOAD_LIST_MATCH_PARLAY),
    takeEvery(actions.LOAD_LIST_LOTTERY, LOAD_LIST_LOTTERY),
  ])
}
