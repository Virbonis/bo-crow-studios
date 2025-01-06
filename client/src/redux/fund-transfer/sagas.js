import { amount } from 'components/blaise'
import { all, call, put, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/fund-transfer'
import { Download } from 'utils'
import actions from './actions'

export function* LOAD_TABLE({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.LoadTable, payload, source)
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
  yield put({ type: actions.SET_STATE, payload: { loadingDetail: true } })
  const response = yield call(svc.LoadDetail, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        detailData: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingDetail: false } })
}

export function* EXPORT({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingExport: true } })
  const response = yield call(svc.LoadTable, payload, source)
  if (response) {
    const title = [
      'Username',
      'Currency',
      'Deposit (F)',
      'Deposit (L)',
      'WithDrawwal (F)',
      'WithDrawal (L)',
      'Balance (F)',
      'Balance (L)',
    ]
    const { data } = response
    const dataNew = data.result.map(e => ({
      username: e.user_login,
      currency: e.currency,
      deposit: amount(e.deposit),
      deposit_rmb: amount(e.deposit_rmb),
      withdrawal: amount(e.withdrawal),
      withdrawal_rmb: amount(e.withdrawal_rmb),
      balance: amount(e.balance),
      balance_rmb: amount(e.balance_rmb),
    }))
    Download(title, dataNew, `Fund Transfer`)
  }
  yield put({ type: actions.SET_STATE, payload: { loadingExport: false } })
}

export function* EXPORT_DETAIL({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingExport: true } })
  const response = yield call(svc.LoadDetail, payload, source)
  if (response) {
    const title = [
      'Trans Date',
      'Fund Type',
      'Currency',
      'Amount',
      'Start Balance',
      'End Balance',
      'Status',
    ]
    const { data } = response
    const dataNew = data.map(e => ({
      tran_date: e.tran_date.formatDateTimeSecond(),
      fund_type_desc: e.fund_type_desc,
      currency: e.currency,
      amount: amount(e.amount),
      start_balance: amount(e.start_balance),
      end_balance: amount(e.end_balance),
      status_desc: e.status_desc,
    }))
    Download(title, dataNew, `Fund Transfer Detail`)
  }
  yield put({ type: actions.SET_STATE, payload: { loadingExport: false } })
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_TABLE, LOAD_TABLE),
    takeLatest(actions.LOAD_DETAIL, LOAD_DETAIL),
    takeLatest(actions.EXPORT, EXPORT),
    takeLatest(actions.EXPORT_DETAIL, EXPORT_DETAIL),
  ])
}
