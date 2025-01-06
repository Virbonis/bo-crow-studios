import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/mapping-glive-stream'
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
export function* LOAD_LEAGUE_GL({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading_select_league_gl: true } })
  const response = yield call(svc.LoadLeagueGL, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        select_league_gl: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading_select_league_gl: false } })
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
export function* LOAD_MATCH_GL({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading_match_gl: true } })
  const response = yield call(svc.LoadMatchGL, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        data_match_gl: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading_match_gl: false } })
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
    takeLatest(actions.LOAD_MATCH_GL, LOAD_MATCH_GL),
    takeLatest(actions.LOAD_LEAGUE, LOAD_LEAGUE),
    takeLatest(actions.LOAD_LEAGUE_GL, LOAD_LEAGUE_GL),
    takeLeading(actions.UPDATE_MAPPING, UPDATE_MAPPING),
  ])
}
