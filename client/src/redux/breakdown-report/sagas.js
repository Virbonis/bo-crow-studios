import { all, put, call, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/breakdown-report'
import { DownloadBetReport } from 'helper'
import actions from './actions'

export function* LOAD_BREAKDOWN_REPORT({ payload, failedCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { [`loadingData${payload.hist_or_post}`]: true } })
  const response = yield call(svc.LoadBreakdownReport, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        [`data${payload.hist_or_post}`]: data,
      },
    })
  } else if (typeof failedCallback === 'function') failedCallback()

  yield put({ type: actions.SET_STATE, payload: { [`loadingData${payload.hist_or_post}`]: false } })
}

export function* LOAD_BET_DETAIL({ payload, source }) {
  yield put({
    type: actions.SET_STATE,
    payload: { [`loadingDetail${payload.hist_or_post}`]: true },
  })
  const response = yield call(svc.LoadBetDetail, payload, source)

  if (response) {
    const { status, data } = response

    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        [`betDetailData${payload.hist_or_post}`]: data,
      },
    })
  }
  yield put({
    type: actions.SET_STATE,
    payload: { [`loadingDetail${payload.hist_or_post}`]: false },
  })
}

export function* DOWNLOAD_BET_DETAIL({ payload, source }) {
  yield put({
    type: actions.SET_STATE,
    payload: { [`loadingDownload${payload.hist_or_post}`]: true },
  })
  const response = yield call(svc.LoadBetDetail, payload, source)
  if (response) {
    const data = response.data?.result || []
    DownloadBetReport(data, `Breakdown Winloss Bet Detail`)
  }
  yield put({
    type: actions.SET_STATE,
    payload: { [`loadingDownload${payload.hist_or_post}`]: false },
  })
}
export function* DOWNLOAD_BET_DETAIL_DATE({ payload, source }) {
  yield put({
    type: actions.SET_STATE,
    payload: { [`loadingDownload${payload.hist_or_post}`]: true },
  })
  const response = yield call(svc.LoadExportDate, payload, source)
  if (response) {
    const data = response.data?.result || []
    DownloadBetReport(data, `Breakdown Winloss Bet Detail By Date`)
  }
  yield put({
    type: actions.SET_STATE,
    payload: { [`loadingDownload${payload.hist_or_post}`]: false },
  })
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_BREAKDOWN_REPORT, LOAD_BREAKDOWN_REPORT),
    takeLatest(actions.LOAD_BET_DETAIL, LOAD_BET_DETAIL),
    takeLatest(actions.DOWNLOAD_BET_DETAIL, DOWNLOAD_BET_DETAIL),
    takeLatest(actions.DOWNLOAD_BET_DETAIL_DATE, DOWNLOAD_BET_DETAIL_DATE),
  ])
}
