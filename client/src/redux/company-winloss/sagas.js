import { all, put, call, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/company-winloss'
import actions from './actions'

export function* LOAD({ payload, failedCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { [`loading${payload.hist_or_post}`]: true } })

  const response = yield call(svc.Load, payload, source)
  if (response) {
    const { data } = response
    const dataTotalCash = data.result_cash.pop()
    // const dataTotalCredit = data.result_credit.pop()
    yield put({
      type: actions.SET_STATE,
      payload: {
        [`dataCash${payload.hist_or_post}`]: data.result_cash,
        [`dataTotalCash${payload.hist_or_post}`]: dataTotalCash,
        [`totalCash${payload.hist_or_post}`]: data.total_cash,
        // dataCredit: data.result_credit,
        // dataTotalCredit,
        // dataGrandTotal: Object.fromEntries(
        //   Object.keys(dataTotalCash).map(e => [e, dataTotalCash[e] + dataTotalCredit[e]]),
        // ),

        // clear data detail
        [`dataDetail${payload.hist_or_post}`]: [],
        [`totalDetail${payload.hist_or_post}`]: 0,
      },
    })
  } else if (typeof failedCallback === 'function') failedCallback()

  yield put({ type: actions.SET_STATE, payload: { [`loading${payload.hist_or_post}`]: false } })
}

export function* LOAD_DETAIL({ payload, failedCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { [`loading${payload.hist_or_post}`]: true } })

  const response = yield call(svc.LoadDetail, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        [`dataDetail${payload.hist_or_post}`]: data.result,
        [`totalDetail${payload.hist_or_post}`]: data.total,
      },
    })
  } else if (typeof failedCallback === 'function') failedCallback()

  yield put({ type: actions.SET_STATE, payload: { [`loading${payload.hist_or_post}`]: false } })
}

export default function* rootSaga() {
  yield all([takeLatest(actions.LOAD, LOAD), takeLatest(actions.LOAD_DETAIL, LOAD_DETAIL)])
}
