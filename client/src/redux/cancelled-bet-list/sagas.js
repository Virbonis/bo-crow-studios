import { all, put, call, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/cancelled-bet-list'
import { DownloadBetReport } from 'helper'
import actions from './actions'

export function* LOAD_USER({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingOption: true } })
  const response = yield call(svc.LoadUser, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        user: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingOption: false } })
}

export function* LOAD({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.Load, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
}

export function* DOWNLOAD_BET_DETAIL({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingExport: true } })
  const response = yield call(svc.Load, payload, source)
  if (response) {
    const { data } = response

    DownloadBetReport(data, 'Cancelled Bet Detail')
  }
  yield put({ type: actions.SET_STATE, payload: { loadingExport: false } })
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_USER, LOAD_USER),
    takeLatest(actions.LOAD, LOAD),
    takeLatest(actions.EXPORT, DOWNLOAD_BET_DETAIL),
  ])
}
