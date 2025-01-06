import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/bet-enquiry'
import * as svcExport from 'services/export'
import { DownloadBetReport } from 'helper'
import actions from './actions'

export function* LOAD_TABLE({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { [`loadingData${payload.hist_or_post}`]: true } })
  const response = yield call(svc.LoadTable, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        [`data${payload.hist_or_post}`]: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { [`loadingData${payload.hist_or_post}`]: false } })
}

export function* LOAD_TABLE_PARLAY({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingPopUpData: true } })
  const response = yield call(svc.LoadTableParlay, payload, source)
  if (response) {
    const { data } = response

    const isFirstRow = (bet_id, match_id) => {
      const index = data.findIndex(x => x.bet_id === bet_id && x.match_id === match_id)
      if (index === -1) return false
      if (index === 0) return true
      const prev = data[index - 1]
      return prev.bet_id !== bet_id
    }
    const summary = data.reduce((acc, cur) => {
      if (!isFirstRow(cur.bet_id, cur.match_id)) return acc
      if (cur.void_id && cur.void_id !== '0') return acc
      if (cur.winloss_status === '') return acc
      return acc + cur.winloss_amount
    }, 0)
    yield put({
      type: actions.SET_STATE,
      payload: {
        popUpDataParlay: data,
        summaryPopUp: summary,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingPopUpData: false } })
}
export function* LOAD_TABLE_LOTTERY({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingPopUpData: true } })
  const response = yield call(svc.LoadTableLottery, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        popUpDataLottery: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingPopUpData: false } })
}
export function* LOAD_TABLE_RESULT({ payload, source }) {
  // if betbuilder call betbuilder api
  if (payload.game_type === 3000) yield LOAD_TABLE_RESULT_BET_BUILDER({ payload, source })

  yield put({ type: actions.SET_STATE, payload: { loadingPopUpData: true } })
  const response = yield call(svc.LoadTableResult, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        popUpDataResult: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingPopUpData: false } })
}
export function* LOAD_TABLE_RESULT_BET_BUILDER({ payload, source }) {
  const response = yield call(svc.GetTableResultBetBuilder, payload, source)
  if (response) {
    const { data } = response
    if (data) {
      const market_name = data.market_name.split(' And ')
      const result = data.result.split(' And ')
      const mergedData = market_name.map((e, index) => ({
        key: index,
        market_name: market_name[index],
        result: result[index],
      }))
      yield put({
        type: actions.SET_STATE,
        payload: {
          popUpDataBetResultBuilder: mergedData,
        },
      })
    }
  }
}

export function* UPDATE({ payload, successCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { [`loadingData${payload.hist_or_post}`]: true } })
  const response = yield call(svc.Update, payload, source)
  if (response) {
    successCallback()
  }
}

export function* DOWNLOAD_BET_DETAIL({ payload, source, fromExportPage }) {
  yield put({
    type: actions.SET_STATE,
    payload: { [`loadingDownload${payload.hist_or_post}`]: true },
  })
  payload.current_page = 1
  payload.page_size = 0

  const svcLoad = !fromExportPage ? svc.LoadTable : svcExport.LoadExportBetEnquiry
  const response = yield call(svcLoad, payload, source)
  if (response) {
    const data = response.data?.result || []
    DownloadBetReport(data, `Bet Enquiry`)
  }
  yield put({
    type: actions.SET_STATE,
    payload: { [`loadingDownload${payload.hist_or_post}`]: false },
  })
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_TABLE, LOAD_TABLE),
    takeLatest(actions.LOAD_TABLE_PARLAY, LOAD_TABLE_PARLAY),
    takeLatest(actions.LOAD_TABLE_LOTTERY, LOAD_TABLE_LOTTERY),
    takeLatest(actions.LOAD_TABLE_RESULT, LOAD_TABLE_RESULT),
    takeLatest(actions.LOAD_TABLE_RESULT_BET_BUILDER, LOAD_TABLE_RESULT_BET_BUILDER),
    takeLatest(actions.LOAD_EXPORT, DOWNLOAD_BET_DETAIL),
    takeLeading(actions.UPDATE, UPDATE),
  ])
}
