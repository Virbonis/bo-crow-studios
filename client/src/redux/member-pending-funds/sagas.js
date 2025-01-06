import { all, call, put, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/member-pending-funds'
import { DownloadBetReport } from 'helper'
import actions from './actions'

export function* LOAD_TABLE({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
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
  yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
}

export function* LOAD_DETAIL({ payload, source }) {
  const { report_type } = payload

  if (report_type === 0) yield LOAD_DAILY_STATEMENT_TABLE({ payload, source })
  else if (report_type === 1) yield LOAD_BET_SUMMARY_TABLE({ payload, source })
  else if (report_type === 2) yield LOAD_BET_LIST({ payload, source })
  else if (report_type === 3) yield LOAD_BET_LIST_RUNNING({ payload, source })
}

export function* LOAD_DAILY_STATEMENT_TABLE({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingDetail: true } })
  const response = yield call(svc.LoadDailyStatement, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        dailyStatementData: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingDetail: false } })
}
export function* LOAD_BET_SUMMARY_TABLE({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingDetail: true } })
  const response = yield call(svc.LoadBetSummary, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        betSummaryData: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingDetail: false } })
}
export function* LOAD_BET_LIST({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingDetail: true } })
  const response = yield call(svc.LoadBetList, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        betListData: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingDetail: false } })
}
export function* LOAD_BET_LIST_RUNNING({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingDetail: true } })
  const response = yield call(svc.LoadBetListRunning, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        betListRunningData: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingDetail: false } })
}

export function* DOWNLOAD_BET_DETAIL({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingExport: true } })

  const { report_type } = payload
  const svcLoad = report_type === 2 ? svc.LoadBetList : svc.LoadBetListRunning
  const response = yield call(svcLoad, payload, source)
  if (response) {
    const { data } = response

    if (report_type === 2) {
      DownloadBetReport(data, 'Member Pending Funds - Bet List')
    } else if (report_type === 3) {
      DownloadBetReport(data, `Member Pending Funds - Bet List Running`)
    }
  }

  yield put({ type: actions.SET_STATE, payload: { loadingExport: false } })
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_TABLE, LOAD_TABLE),
    takeLatest(actions.LOAD_DETAIL, LOAD_DETAIL),
    takeLatest(actions.LOAD_DAILY_STATEMENT, LOAD_DAILY_STATEMENT_TABLE),
    takeLatest(actions.LOAD_BET_SUMMARY, LOAD_BET_SUMMARY_TABLE),
    takeLatest(actions.LOAD_BET_LIST, LOAD_BET_LIST),
    takeLatest(actions.LOAD_BET_LIST_RUNNING, LOAD_BET_LIST_RUNNING),
    takeLatest(actions.EXPORT, DOWNLOAD_BET_DETAIL),
  ])
}
