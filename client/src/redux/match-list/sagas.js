import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/match-list'
import * as svcSpecialCode from 'services/special-code'
import actions from './actions'

export function* LOAD({ payload, successCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadData, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        data,
      },
    })
    if (typeof successCallback === 'function') successCallback()
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}
export function* LOAD_MATCH_EDIT({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingEdit: true } })
  const response = yield call(svc.Get, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        dataEdit: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingEdit: false } })
}
export function* UPDATE_MATCH_EDIT({ payload, successCallback, source }) {
  const response = yield call(svc.Update, payload, source)
  if (response) {
    successCallback()
  }
}
export function* DELETE({ payload, successCallback, source }) {
  const response = yield call(svc.Delete, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}

export function* LOAD_SPECIAL_CODE({ payload, source }) {
  const response = yield call(svcSpecialCode.LoadBySport, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        specialCode: data,
      },
    })
  }
}

export function* LOAD_MATCH_INFO({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingInfo: true } })
  const response = yield call(svc.LoadMatchInfo, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        dataInfo: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingInfo: false } })
}
export function* UPDATE_MATCH_INFO({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateMatchInfo, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}

export function* LOAD_LIST_SUB_MATCH({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingList: true } })
  const response = yield call(svc.LoadListSubMatch, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        dataListSubMatch: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingList: false } })
}

export function* LOAD_DETAIL_SPECIAL({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingDetail: true } })
  const response = yield call(svc.LoadDetailSpecial, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        dataDetail: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingDetail: false } })
}
export function* DELETE_DETAIL_SPECIAL({ payload, successCallback, source }) {
  const response = yield call(svc.DeleteDetailSpecial, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}

export function* LOAD_MATCH_SPECIAL({ payload, source }) {
  // soccer, tennis, basket, cricket, badminton, pool, e-sport, volley
  yield put({ type: actions.SET_STATE, payload: { loadingSpecial: true } })
  const response = yield call(svc.LoadMatchSpecial, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        dataMatchSpecial: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingSpecial: false } })
}
export function* UPDATE_MATCH_SPECIAL({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateMatchSpecial, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}

export function* LOAD_MATCH_SPECIAL_MORE({ payload, source }) {
  // soccer, tennis, badminton, basket
  yield put({ type: actions.SET_STATE, payload: { loadingSpecial: true } })
  const response = yield call(svc.LoadMatchSpecialMore, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        dataMatchSpecialMore: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingSpecial: false } })
}
export function* UPDATE_MATCH_SPECIAL_MORE({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateMatchSpecialMore, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD, LOAD),
    takeLeading(actions.DELETE, DELETE),

    takeLatest(actions.LOAD_SPECIAL_CODE, LOAD_SPECIAL_CODE),
    takeLatest(actions.LOAD_MATCH_EDIT, LOAD_MATCH_EDIT),
    takeLeading(actions.UPDATE_MATCH_EDIT, UPDATE_MATCH_EDIT),

    takeLatest(actions.LOAD_LIST_SUB_MATCH, LOAD_LIST_SUB_MATCH),

    takeLatest(actions.LOAD_DETAIL_SPECIAL, LOAD_DETAIL_SPECIAL),
    takeLeading(actions.DELETE_DETAIL_SPECIAL, DELETE_DETAIL_SPECIAL),

    takeLatest(actions.LOAD_MATCH_INFO, LOAD_MATCH_INFO),
    takeLeading(actions.UPDATE_MATCH_INFO, UPDATE_MATCH_INFO),

    takeLatest(actions.LOAD_MATCH_SPECIAL, LOAD_MATCH_SPECIAL),
    takeLeading(actions.UPDATE_MATCH_SPECIAL, UPDATE_MATCH_SPECIAL),

    takeLatest(actions.LOAD_MATCH_SPECIAL_MORE, LOAD_MATCH_SPECIAL_MORE),
    takeLeading(actions.UPDATE_MATCH_SPECIAL_MORE, UPDATE_MATCH_SPECIAL_MORE),
  ])
}
