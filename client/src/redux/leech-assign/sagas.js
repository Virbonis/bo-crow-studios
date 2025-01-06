import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/leech-assign'
import actions from './actions'

export function* LOAD_LEAGUE_TABLE({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingLeagueData: true } })
  const response = yield call(svc.LoadLeagueTable, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        leagueData: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingLeagueData: false } })
}

export function* LOAD_MATCH_TABLE({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.LoadMatchTable, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
}

export function* LOAD_POPUP_TABLE({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingPopUpData: true } })
  const response = yield call(svc.LoadPopupTable, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        popUpData: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingPopUpData: false } })
}

export function* UPDATE_LEAGUE({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateLeague, payload, source)
  if (response) {
    successCallback()
  }
}

export function* UPDATE_MATCH({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateMatch, payload, source)
  if (response) {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_MATCH_TABLE, LOAD_MATCH_TABLE),
    takeLatest(actions.LOAD_LEAGUE_TABLE, LOAD_LEAGUE_TABLE),
    takeLatest(actions.LOAD_POPUP_TABLE, LOAD_POPUP_TABLE),
    takeLeading(actions.UPDATE_LEAGUE, UPDATE_LEAGUE),
    takeLeading(actions.UPDATE_MATCH, UPDATE_MATCH),
  ])
}
