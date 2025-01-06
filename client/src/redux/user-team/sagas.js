import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import { RetryPreload } from 'redux/preload-state'
import * as svc from 'services/user-team'
import actions from './actions'

export function* PRELOAD() {
  const response = yield RetryPreload(svc.LoadSelect)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        select: data,
      },
    })
  }
}

export function* LOAD_USER_TEAM({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadUserTeam, payload, source)
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
export function* ADD_USER_TEAM({ payload, source, successCallback }) {
  const response = yield call(svc.AddUserTeam, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
    yield PRELOAD()
  }
}
export function* UPDATE_USER_TEAM({ payload, source, successCallback }) {
  const response = yield call(svc.UpdateUserTeam, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
    yield PRELOAD()
  }
}
export function* DELETE_USER_TEAM({ payload, source, successCallback }) {
  const response = yield call(svc.DeleteUserTeam, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
    yield PRELOAD()
  }
}

export function* LOAD_USER_TEAM_SUB({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingSub: true } })
  const response = yield call(svc.LoadUserTeamSub, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        team: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingSub: false } })
}
export function* ADD_USER_TEAM_SUB({ payload, source, successCallback }) {
  const response = yield call(svc.AddUserTeamSub, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}
export function* UPDATE_USER_TEAM_SUB({ payload, source, successCallback }) {
  const response = yield call(svc.UpdateUserTeamSub, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}
export function* DELETE_USER_TEAM_SUB({ payload, source, successCallback }) {
  const response = yield call(svc.DeleteUserTeamSub, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}

export function* LOAD_MAPPING_USER({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingUser: true } })
  const response = yield call(svc.LoadMappingUser, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        user: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingUser: false } })
}
export function* UPDATE_MAPPING_USER({ payload, source, successCallback }) {
  const response = yield call(svc.UpdateMappingUser, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}
export function* LOAD_MAPPING_USER_SUB({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingUser: true } })
  const response = yield call(svc.LoadMappingUserSub, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        user: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingUser: false } })
}
export function* UPDATE_MAPPING_USER_SUB({ payload, source, successCallback }) {
  const response = yield call(svc.UpdateMappingUserSub, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
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
        league: data.result,
        total_data_league: data.total,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingLeague: false } })
}
export function* UPDATE_LEAGUE({ payload, source, successCallback }) {
  const response = yield call(svc.UpdateLeague, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}
export default function* rootSaga() {
  yield all([
    takeLatest(actions.PRELOAD, PRELOAD),
    takeLatest(actions.LOAD_USER_TEAM, LOAD_USER_TEAM),
    takeLatest(actions.ADD_USER_TEAM, ADD_USER_TEAM),
    takeLeading(actions.UPDATE_USER_TEAM, UPDATE_USER_TEAM),
    takeLeading(actions.DELETE_USER_TEAM, DELETE_USER_TEAM),

    takeLatest(actions.LOAD_USER_TEAM_SUB, LOAD_USER_TEAM_SUB),
    takeLatest(actions.ADD_USER_TEAM_SUB, ADD_USER_TEAM_SUB),
    takeLeading(actions.UPDATE_USER_TEAM_SUB, UPDATE_USER_TEAM_SUB),
    takeLeading(actions.DELETE_USER_TEAM_SUB, DELETE_USER_TEAM_SUB),

    takeLatest(actions.LOAD_MAPPING_USER, LOAD_MAPPING_USER),
    takeLeading(actions.UPDATE_MAPPING_USER, UPDATE_MAPPING_USER),
    takeLatest(actions.LOAD_MAPPING_USER_SUB, LOAD_MAPPING_USER_SUB),
    takeLeading(actions.UPDATE_MAPPING_USER_SUB, UPDATE_MAPPING_USER_SUB),

    takeLatest(actions.LOAD_LEAGUE, LOAD_LEAGUE),
    takeLeading(actions.UPDATE_LEAGUE, UPDATE_LEAGUE),
  ])
}
