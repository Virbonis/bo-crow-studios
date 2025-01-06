import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/mapping-rball-match'
import actions from './actions'

export function* LOAD_LEAGUE({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading_select_league: true } })
  const response = yield call(svc.LoadLeague, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        select_league: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading_select_league: false } })
}
export function* LOAD_LEAGUE_RB({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading_select_league_rb: true } })
  const response = yield call(svc.LoadLeagueRB, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        select_league_rb: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading_select_league_rb: false } })
}

export function* LOAD_MATCH({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading_match: true } })
  const response = yield call(svc.LoadMatch, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        data_match: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading_match: false } })
}
export function* LOAD_MATCH_RB({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading_match_rb: true } })
  const response = yield call(svc.LoadMatchRB, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        data_match_rb: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading_match_rb: false } })
}

export function* UPDATE_MAPPING({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateMapping, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_MATCH, LOAD_MATCH),
    takeLatest(actions.LOAD_LEAGUE, LOAD_LEAGUE),
    takeLatest(actions.LOAD_LEAGUE_RB, LOAD_LEAGUE_RB),
    takeLatest(actions.LOAD_MATCH_RB, LOAD_MATCH_RB),
    takeLeading(actions.UPDATE_MAPPING, UPDATE_MAPPING),
  ])
}
