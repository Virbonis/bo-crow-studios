import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import { RetryPreload } from 'redux/preload-state'
import * as svc from 'services/branch'
import actions from './actions'

export function* PRELOAD({ source }) {
  const response = yield RetryPreload(svc.LoadSelect, source)
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

export function* LOAD({ source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.Load, source)
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

export function* UPDATE_LIVE_STREAM({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateBranchLiveStream, payload, source)
  if (response) {
    successCallback()
  }
}

export function* UPDATE({ payload, successCallback, source }) {
  const response = yield call(svc.Update, payload, source)
  if (response) {
    successCallback()
  }
}

export function* LOAD_LIMIT({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadBranchLimit, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        limit: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export function* UPDATE_LIMIT({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateBranchLimit, payload, source)
  if (response) {
    successCallback()
  }
}

export function* LOAD_SPORT_LIMIT({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadBranchSportLimit, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        sportLimit: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export function* DELETE_SPORT_LIMIT({ payload, successCallback, source }) {
  const response = yield call(svc.DeleteBranchSportLimit, payload, source)
  if (response) {
    successCallback()
  }
}

export function* UPDATE_SPORT_LIMIT({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateBranchSportLimit, payload, source)
  if (response) {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.PRELOAD, PRELOAD),
    takeLatest(actions.LOAD, LOAD),
    takeLeading(actions.UPDATE_LIVE_STREAM, UPDATE_LIVE_STREAM),
    takeLeading(actions.UPDATE, UPDATE),

    takeLatest(actions.LOAD_LIMIT, LOAD_LIMIT),
    takeLatest(actions.LOAD_SPORT_LIMIT, LOAD_SPORT_LIMIT),
    takeLeading(actions.UPDATE_LIMIT, UPDATE_LIMIT),
    takeLeading(actions.DELETE_SPORT_LIMIT, DELETE_SPORT_LIMIT),
    takeLeading(actions.UPDATE_SPORT_LIMIT, UPDATE_SPORT_LIMIT),
  ])
}
