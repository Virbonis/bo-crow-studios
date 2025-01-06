import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/mapping-bg-match'
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
export function* LOAD_LEAGUE_BG({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading_select_league_bg: true } })
  const response = yield call(svc.LoadLeagueBG, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        select_league_bg: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading_select_league_bg: false } })
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
export function* LOAD_MATCH_BG({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading_match_bg: true } })
  const response = yield call(svc.LoadMatchBG, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        data_match_bg: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading_match_bg: false } })
}

export function* UPDATE_MAPPING({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateMapping, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}
export function* LOAD_GAME_EVENT({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadBGGameEvent, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        data_game_event: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_LEAGUE, LOAD_LEAGUE),
    takeLatest(actions.LOAD_LEAGUE_BG, LOAD_LEAGUE_BG),
    takeLatest(actions.LOAD_MATCH, LOAD_MATCH),
    takeLatest(actions.LOAD_MATCH_BG, LOAD_MATCH_BG),
    takeLeading(actions.UPDATE_MAPPING, UPDATE_MAPPING),
    takeLatest(actions.LOAD_GAME_EVENT, LOAD_GAME_EVENT),
  ])
}
