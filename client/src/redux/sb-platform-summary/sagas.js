import { all, call, put, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/sb-platform-summary'
import { getPlatform } from 'helper'
import { Download } from 'utils'
import { amount } from 'components/blaise'
import actions from './actions'

export function* LOAD_TABLE({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.LoadTable, payload, source)
  if (response) {
    const { data } = response

    const newData = transformSubtotal(data)
    const summary = data.reduce(
      (acc, curr) => {
        acc.bet_amount += curr.bet_amount
        acc.ticket += curr.ticket
        acc.users += curr.users
        return acc
      },
      {
        bet_amount: 0,
        ticket: 0,
        users: 0,
      },
    )

    yield put({
      type: actions.SET_STATE,
      payload: {
        data: newData,
        summary,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
}

const title = [
  'Transaction Date',
  'Platform',
  'Currency',
  'Turnover (RMB)',
  'Total Bet Count',
  'Total Unique User',
]
export function* EXPORT({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingExport: true } })
  const response = yield call(svc.LoadTable, payload, source)
  if (response) {
    const { data } = response

    const newData = transformSubtotal(data)
    const dataNew = newData.map(e => {
      return {
        bet_date: !e.isSubtotal ? e.bet_date : 'Sub Total',
        txn_type: !e.isSubtotal ? getPlatform(e.txn_type) : '',
        currency: !e.isSubtotal ? e.currency : '',
        bet_amount: amount(e.bet_amount),
        ticket: e.ticket,
        users: e.users,
      }
    })
    Download(title, dataNew, `SB Platform Summary`)
  }
  yield put({ type: actions.SET_STATE, payload: { loadingExport: false } })
}

const transformSubtotal = data => {
  return data.reduce((acc, curr) => {
    if (!acc.find(e => e.bet_date === curr.bet_date)) {
      const subMatch = data
        .filter(e => e.bet_date === curr.bet_date)
        .map(x => ({
          ...x,
          key: `${x.bet_date}-${x.txn_type}-${x.currency}`,
        }))
      const subTotal = subMatch.reduce(
        (sTotal, match) => {
          sTotal.bet_amount += match.bet_amount
          sTotal.ticket += match.ticket
          sTotal.users += match.users
          return sTotal
        },
        {
          bet_amount: 0,
          ticket: 0,
          users: 0,
        },
      )
      acc = acc.concat([
        ...subMatch,
        {
          key: `${curr.bet_date}-subtotal`,
          isSubtotal: true,
          ...subTotal,
        },
      ])
    }
    return acc
  }, [])
}

export default function* rootSaga() {
  yield all([takeLatest(actions.LOAD_TABLE, LOAD_TABLE), takeLatest(actions.EXPORT, EXPORT)])
}
