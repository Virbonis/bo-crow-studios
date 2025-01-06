import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/auto-add-sub-match'
import actions from './actions'

export function* LOAD_DATA({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })

  yield GET_MAX_LINE({ payload, source })
  yield LOAD_LIST_IBC({ payload, source })
  yield LOAD_LIST_GLIVE({ payload: { ...payload, bookmarker_name: 'IBC' }, source })
  yield LOAD_LIST_GLIVE({ payload: { ...payload, bookmarker_name: 'SBO' }, source })

  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export function* GET_MAX_LINE({ payload, source }) {
  const response = yield call(svc.GetMaxLine, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        max_line: data,
      },
    })
  }
}
export function* LOAD_LIST_IBC({ payload, source }) {
  const response = yield call(svc.ListIBC, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        ibc: data,
      },
    })
  }
}
export function* LOAD_LIST_GLIVE({ payload, source }) {
  const key = `glive_${payload.bookmarker_name.toLowerCase()}`
  const response = yield call(svc.ListGLive, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        [key]: data,
      },
    })
  }
}
export function* UPDATE_AUTO_ADD_SUB_MATCH({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateAutoAddSubMatch, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}
export function* UPDATE_AUTO_ADD_SUB_MATCH_SYNC_MARKET({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateAutoAddSubMatchSyncMarket, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}
export function* UPDATE_AUTO_ADD_SUB_MATCH_SYNC_LEAGUE({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateAutoAddSubMatchSyncLeague, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback(response)
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_DATA, LOAD_DATA),
    takeLeading(actions.UPDATE_AUTO_ADD_SUB_MATCH, UPDATE_AUTO_ADD_SUB_MATCH),
    takeLeading(
      actions.UPDATE_AUTO_ADD_SUB_MATCH_SYNC_MARKET,
      UPDATE_AUTO_ADD_SUB_MATCH_SYNC_MARKET,
    ),
    takeLeading(
      actions.UPDATE_AUTO_ADD_SUB_MATCH_SYNC_LEAGUE,
      UPDATE_AUTO_ADD_SUB_MATCH_SYNC_LEAGUE,
    ),
  ])
}
