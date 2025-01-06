import { all, put, call, takeLatest, takeLeading, takeEvery } from 'redux-saga/effects'
import * as svc from 'services/scoring-outright'
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

export function* LOAD_TEAM({ payload, source }) {
  const keyLoading = `loadingTeam_${payload.outright_id}`
  const keyData = `dataTeam_${payload.outright_id}`

  yield put({ type: actions.SET_STATE, payload: { [keyLoading]: true } })
  const response = yield call(svc.LoadTeam, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        [keyData]: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { [keyLoading]: false } })
}

export function* DELETE({ payload, successCallback, source }) {
  const response = yield call(svc.Delete, payload, source)
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

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD, LOAD),
    takeEvery(actions.LOAD_TEAM, LOAD_TEAM),
    takeLatest(actions.DELETE, DELETE),
    takeLeading(actions.UPDATE, UPDATE),
  ])
}
