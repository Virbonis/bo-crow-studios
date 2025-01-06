import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/match'
import actions from './actions'

export function* LOAD_SELECT({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadSelect, payload, source)
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
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}
export function* LOAD_SELECT_IN_BETLIST({ payload, source }) {
  const response = yield call(svc.LoadSelectInBetList, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        select_in_betlist: data,
      },
    })
  }
}
export function* LOAD_SELECT_IN_MO({ payload, source }) {
  const response = yield call(svc.LoadSelectInMO, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        select_in_mo: data,
      },
    })
  }
}

export function* UPDATE_SELECT({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateSelect, payload, source)
  if (response) {
    successCallback()
  }
}

export function* CREATE({ payload, successCallback, source }) {
  const response = yield call(svc.Create, payload, source)
  if (response) {
    successCallback(response)
  }
}

export function* LOAD_MATCH_SEQUENCE({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadMatchSequence, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        data_match_sequence: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export function* UPDATE_MATCH_SEQUENCE({ payload, successCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.UpdateMatchSequence, { match: payload }, source)
  if (response) {
    successCallback()
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export function* LOAD_SELECT_IN_INSTANTBET({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingSearch: true } })
  const response = yield call(svc.LoadSelectInInstantBet, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        select_in_instantbet: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingSearch: false } })
}

export function* SWAP_MATCH_SEQUENCE({ payload, successCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.SwapMatchSequence, payload, source)
  if (response) {
    successCallback()
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_SELECT, LOAD_SELECT),
    takeLatest(actions.LOAD_MATCH_SEQUENCE, LOAD_MATCH_SEQUENCE),
    takeLatest(actions.LOAD_SELECT_IN_BETLIST, LOAD_SELECT_IN_BETLIST),
    takeLatest(actions.LOAD_SELECT_IN_MO, LOAD_SELECT_IN_MO),
    takeLatest(actions.LOAD_SELECT_IN_INSTANTBET, LOAD_SELECT_IN_INSTANTBET),
    takeLeading(actions.UPDATE_SELECT, UPDATE_SELECT),
    takeLeading(actions.CREATE, CREATE),
    takeLeading(actions.UPDATE_MATCH_SEQUENCE, UPDATE_MATCH_SEQUENCE),
    takeLeading(actions.SWAP_MATCH_SEQUENCE, SWAP_MATCH_SEQUENCE),
  ])
}
