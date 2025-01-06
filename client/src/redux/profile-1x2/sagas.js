import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import { RetryPreload } from 'redux/preload-state'
import * as svc from 'services/profile-1x2'
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
  const responseHDP = yield RetryPreload(svc.LoadHDPList, source)
  if (responseHDP) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        status: responseHDP.status,
        selectHDP: responseHDP.data,
      },
    })
  }
}

export function* LOAD({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.LoadData, payload, source)
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

export function* UPDATE({ payload, successCallback, source }) {
  const response = yield call(svc.Update, payload, source)
  if (response) {
    successCallback()
  }
}

export function* CREATE({ payload, successCallback, source }) {
  const response = yield call(svc.Create, payload, source)
  if (response) {
    yield PRELOAD({ source })
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.PRELOAD, PRELOAD),
    takeLatest(actions.LOAD, LOAD),
    takeLeading(actions.UPDATE, UPDATE),
    takeLeading(actions.CREATE, CREATE),
  ])
}
