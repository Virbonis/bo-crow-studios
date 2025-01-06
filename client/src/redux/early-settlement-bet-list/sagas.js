import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/early-settlement-bet-list'
import { DownloadBetReport } from 'helper'
import actions from './actions'

export function* LOAD({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
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
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export function* DOWNLOAD_BET_DETAIL({ payload }) {
  const response = yield call(svc.Load, payload)
  if (response) {
    const { data } = response

    DownloadBetReport(data, `Early Settlement Bet Detail`)
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.LOAD, LOAD), takeLatest(actions.DOWNLOAD, DOWNLOAD_BET_DETAIL)])
}
