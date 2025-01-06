import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/cancel-outright'
import actions from './actions'

export function* LOAD_CANCEL_OUTRIGHT({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.LoadCancelOutright, payload, source)
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

export function* LOAD_CANCEL_OUTRIGHT_TEAM({ payload, source }) {
  const keyLoading = `loadingTeam_${payload.outright_id}`
  const keyData = `dataTeam_${payload.outright_id}`

  yield put({ type: actions.SET_STATE, payload: { [keyLoading]: true } })
  const response = yield call(svc.LoadCancelOutrightTeam, payload, source)
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

export function* UPDATE_CANCEL_OUTRIGHT({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateCancelOutright, payload, source)
  if (response) {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([takeLatest(actions.LOAD_CANCEL_OUTRIGHT, LOAD_CANCEL_OUTRIGHT)])
  yield all([takeLatest(actions.LOAD_CANCEL_OUTRIGHT_TEAM, LOAD_CANCEL_OUTRIGHT_TEAM)])
  yield all([takeLeading(actions.UPDATE_CANCEL_OUTRIGHT, UPDATE_CANCEL_OUTRIGHT)])
}
