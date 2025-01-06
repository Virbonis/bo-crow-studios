import { all, put, call, takeLeading, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/leeching-assignment'
import actions from './actions'

export function* LOAD_SPORT({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingSport: true } })
  const response = yield call(svc.LoadSport, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        sportData: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingSport: false } })
}

export function* LOAD_LEAGUE({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingLeague: true } })
  const response = yield call(svc.LoadLeague, payload, source)
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
  yield put({ type: actions.SET_STATE, payload: { loadingLeague: false } })
}

export function* UPDATE_SPORT({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateSport, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}

export function* UPDATE_LEAGUE({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateLeague, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_SPORT, LOAD_SPORT),
    takeLatest(actions.LOAD_LEAGUE, LOAD_LEAGUE),
    takeLeading(actions.UPDATE_SPORT, UPDATE_SPORT),
    takeLeading(actions.UPDATE_LEAGUE, UPDATE_LEAGUE),
  ])
}
