import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/team'
import actions from './actions'

export function* LOAD({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.Load, payload, source)
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
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}
export function* LOAD_DETAIL({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingDetail: true } })
  const response = yield call(svc.LoadDetail, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        detail: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingDetail: false } })
}

export function* CREATE({ payload, successCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.Create, payload, source)
  if (response) {
    successCallback()
  }
}

export function* UPDATECOUNTRY({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateCountry, payload, source)
  if (response) {
    successCallback()
  }
}
export function* UPDATE({ payload, successCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.Update, payload, source)
  if (response) {
    successCallback()
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}
export function* DELETE({ payload, successCallback, source }) {
  const response = yield call(svc.Delete, payload, source)
  if (response) {
    successCallback()
  }
}

export function* LOAD_SELECT_IN_ADDMATCH({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingSearch: true } })
  const response = yield call(svc.LoadTeamAddMatch, payload, source)
  if (response) {
    const { data } = response
    const stringKey = `select_in_addmatch_${payload.key}`
    yield put({
      type: actions.SET_STATE,
      payload: {
        [stringKey]: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingSearch: false } })
}
export function* LOAD_SELECT_IN_STANDINGS({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingSearch: true } })
  const response = yield call(svc.LoadTeamStandingsKnockout, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        select_in_standings: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingSearch: false } })
}
export function* LOAD_SELECT_IN_KNOCKOUTS({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingSearch: true } })
  const response = yield call(svc.LoadTeamStandingsKnockout, payload, source)
  if (response) {
    const { data } = response
    const stringKey = `select_in_knockouts_${payload.key}`
    yield put({
      type: actions.SET_STATE,
      payload: {
        [stringKey]: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingSearch: false } })
}

export function* LOAD_SELECT_IN_OUTRIGHT({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingSearch: true } })
  const response = yield call(svc.LoadTeamAddOutright, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        select_in_outright: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingSearch: false } })
}

export function* LOAD_SELECT_IN_MAPPING_TEAM({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingSearch: true } })
  const response = yield call(svc.LoadTeamMappingTeam, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        select_in_mapping_team: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingSearch: false } })
}

export function* LOAD_SELECT_IN_MAPPING_TEAM_RB({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingSearch: true } })
  const response = yield call(svc.LoadTeamMappingTeamRB, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        select_in_mapping_team: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingSearch: false } })
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD, LOAD),
    takeLatest(actions.LOAD_DETAIL, LOAD_DETAIL),
    takeLatest(actions.LOAD_SELECT_IN_ADDMATCH, LOAD_SELECT_IN_ADDMATCH),
    takeLatest(actions.LOAD_SELECT_IN_STANDINGS, LOAD_SELECT_IN_STANDINGS),
    takeLatest(actions.LOAD_SELECT_IN_KNOCKOUTS, LOAD_SELECT_IN_KNOCKOUTS),
    takeLatest(actions.LOAD_SELECT_IN_OUTRIGHT, LOAD_SELECT_IN_OUTRIGHT),
    takeLatest(actions.LOAD_SELECT_IN_MAPPING_TEAM, LOAD_SELECT_IN_MAPPING_TEAM),
    takeLatest(actions.LOAD_SELECT_IN_MAPPING_TEAM_RB, LOAD_SELECT_IN_MAPPING_TEAM_RB),
    takeLeading(actions.CREATE, CREATE),
    takeLeading(actions.UPDATE_COUNTRY, UPDATECOUNTRY),
    takeLeading(actions.UPDATE, UPDATE),
    takeLeading(actions.DELETE, DELETE),
  ])
}
