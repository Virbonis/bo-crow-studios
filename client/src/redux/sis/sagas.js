import { all, put, call, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/sis'
import actions from './actions'

export function* LOAD_ACTION_LOG({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.LoadActionLog, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        data_action_log: data.map(value => ({ ...payload, ...value })),
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
}
export function* LOAD_ACTION_LOG_DETAIL({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingDetail: true } })
  const response = yield call(svc.LoadMarketLog, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        data_action_log_detail: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingDetail: false } })
}
export function* LOAD_MARKET({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.LoadMarket, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        data_market: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
}
export function* LOAD_MARKET_LOG({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.LoadMarketLog, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        data_market_log: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
}
export function* LOAD_MATCH_LIST({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.LoadMatchList, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        data_match_list: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_ACTION_LOG, LOAD_ACTION_LOG),
    takeLatest(actions.LOAD_ACTION_LOG_DETAIL, LOAD_ACTION_LOG_DETAIL),
    takeLatest(actions.LOAD_MARKET, LOAD_MARKET),
    takeLatest(actions.LOAD_MARKET_LOG, LOAD_MARKET_LOG),
    takeLatest(actions.LOAD_MATCH_LIST, LOAD_MATCH_LIST),
  ])
}
