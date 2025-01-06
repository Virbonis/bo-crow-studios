import { all, put, call, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/bbz'
import actions from './actions'

export function* RESET_SERVICE({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  yield call(svc.ResetService, payload, source)
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export function* LOAD_CHANNEL_MONITORING({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadChannelMonitoring, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        data_channel_monitor: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}
export function* LOAD_MATCH_LIST({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadMatchList, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        data_match_list: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}
export function* LOAD_ACTION_LOG({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadActionLog, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        data_action_log: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}
export function* LOAD_MARKET({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadMarket, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        data_market: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}
export function* LOAD_MARKET_LOG({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadMarketLog, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        data_market_log: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}
export function* LOAD_INCIDENT({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadIncident, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        data_incident: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}
export default function* rootSaga() {
  yield all([
    takeLatest(actions.RESET_SERVICE, RESET_SERVICE),
    takeLatest(actions.LOAD_CHANNEL_MONITORING, LOAD_CHANNEL_MONITORING),
    takeLatest(actions.LOAD_MATCH_LIST, LOAD_MATCH_LIST),
    takeLatest(actions.LOAD_ACTION_LOG, LOAD_ACTION_LOG),
    takeLatest(actions.LOAD_MARKET, LOAD_MARKET),
    takeLatest(actions.LOAD_MARKET_LOG, LOAD_MARKET_LOG),
    takeLatest(actions.LOAD_INCIDENT, LOAD_INCIDENT),
  ])
}
