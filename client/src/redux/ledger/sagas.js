import { all, put, call, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/ledger'
import { DownloadBetReport } from 'helper'
import actions from './actions'

export function* LOAD_LEDGER_MAIN({ payload, failedCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { [`loading_data${payload.hist_or_post}`]: true } })

  const { report_type } = payload
  let svcLoad
  if (report_type === 'SMA') svcLoad = svc.LoadLedgerMain
  else if (report_type === 'ShareholderCash') svcLoad = svc.LoadLedgerMainShareholderCash
  else svcLoad = svc.LoadLedgerMainMember

  const response = yield call(svcLoad, payload, source)
  if (response) {
    const { data } = response

    yield put({
      type: actions.SET_STATE,
      payload: {
        [`data_ledger${payload.hist_or_post}`]: data,
      },
    })
  } else if (typeof failedCallback === 'function') failedCallback()

  yield put({
    type: actions.SET_STATE,
    payload: { [`loading_data${payload.hist_or_post}`]: false },
  })
}

export function* LOAD_LEDGER_AVERAGE({ payload, failedCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { [`loading_data${payload.hist_or_post}`]: true } })
  const { report_type } = payload
  let svcLoad
  if (report_type === 'AvgSMA') svcLoad = svc.LoadLedgerAverage
  else if (report_type === 'AvgShareholderCash') svcLoad = svc.LoadLedgerAverageShareholderCash
  else svcLoad = svc.LoadLedgerAvgMember

  const response = yield call(svcLoad, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        [`data_ledger${payload.hist_or_post}`]: data,
      },
    })
  } else if (typeof failedCallback === 'function') failedCallback()

  yield put({
    type: actions.SET_STATE,
    payload: { [`loading_data${payload.hist_or_post}`]: false },
  })
}

export function* LOAD_LEDGER_NEW({ payload, failedCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { [`loading_data${payload.hist_or_post}`]: true } })
  const { report_type } = payload
  let svcLoad
  if (report_type === 'NewShareholder') svcLoad = svc.LoadLedgerNew
  else if (report_type === 'NewShareholderCash') svcLoad = svc.LoadLedgerNewShareholderCash
  else svcLoad = svc.LoadLedgerNewMember

  const response = yield call(svcLoad, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        [`data_ledger${payload.hist_or_post}`]: data,
      },
    })
  } else if (typeof failedCallback === 'function') failedCallback()
  yield put({
    type: actions.SET_STATE,
    payload: { [`loading_data${payload.hist_or_post}`]: false },
  })
}

export function* LOAD_LEDGER_BREAKDOWN({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { [`loading_data${payload.hist_or_post}`]: true } })

  const response = yield call(svc.LoadLedgerBreakdown, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        [`data_ledger${payload.hist_or_post}`]: data.result,
      },
    })
  }

  yield put({
    type: actions.SET_STATE,
    payload: { [`loading_data${payload.hist_or_post}`]: false },
  })
}

export function* LOAD_LEDGER_DETAIL({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { [`loading_data${payload.hist_or_post}`]: true } })

  const response = yield call(svc.LoadLedgerDetail, payload, source)
  if (response) {
    const { data } = response
    const newData = data.result.map((e, index) => ({ ...e, key: index }))
    yield put({
      type: actions.SET_STATE,
      payload: {
        [`data_ledger_detail${payload.hist_or_post}`]: newData,
        [`total_ledger_detail${payload.hist_or_post}`]: data.total,
        [`data_ledger_summary${payload.hist_or_post}`]: data.summary,
      },
    })
  }

  yield put({
    type: actions.SET_STATE,
    payload: { [`loading_data${payload.hist_or_post}`]: false },
  })
}

export function* DOWNLOAD_BET_DETAIL({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: { [`loadingExport${payload.hist_or_post}`]: true },
  })

  const response = yield call(svc.LoadLedgerDetail, payload)
  if (response) {
    const data = response.data?.result || []
    DownloadBetReport(data, `Ledger Bet Detail`)
  }
  yield put({
    type: actions.SET_STATE,
    payload: { [`loadingExport${payload.hist_or_post}`]: false },
  })
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_LEDGER_MAIN, LOAD_LEDGER_MAIN),
    takeLatest(actions.LOAD_LEDGER_AVG, LOAD_LEDGER_AVERAGE),
    takeLatest(actions.LOAD_LEDGER_NEW, LOAD_LEDGER_NEW),
    takeLatest(actions.LOAD_LEDGER_BREAKDOWN, LOAD_LEDGER_BREAKDOWN),
    takeLatest(actions.LOAD_LEDGER_DETAIL, LOAD_LEDGER_DETAIL),
    takeLatest(actions.EXPORT_DETAIL, DOWNLOAD_BET_DETAIL),
  ])
}
