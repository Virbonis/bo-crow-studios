import { all, put, call, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/im'
import actions from './actions'

export function* RESET_SERVICE({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  yield call(svc.ResetService, payload, source)
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

export default function* rootSaga() {
  yield all([
    takeLatest(actions.RESET_SERVICE, RESET_SERVICE),
    takeLatest(actions.LOAD_MATCH_LIST, LOAD_MATCH_LIST),
    takeLatest(actions.LOAD_ACTION_LOG, LOAD_ACTION_LOG),
    takeLatest(actions.LOAD_MARKET, LOAD_MARKET),
  ])
}
