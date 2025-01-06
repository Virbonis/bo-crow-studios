import { all, put, call, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/company-winloss'
import actions from './actions'

export function* LOAD({ payload, failedCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })

  const response = yield call(svc.LoadForeign, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        dataCash: data.result_cash,
        totalCash: data.total_cash,
        // dataCredit: data.result_credit,
        // dataGrandTotal: Object.fromEntries(
        //   Object.keys(dataTotalCash).map(e => [e, dataTotalCash[e] + dataTotalCredit[e]]),
        // ),

        // clear data detail
        dataDetail: [],
        totalDetail: 0,
      },
    })
  } else if (typeof failedCallback === 'function') failedCallback()

  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export function* LOAD_DETAIL({ payload, failedCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })

  const response = yield call(svc.LoadDetail, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        dataDetail: data.result,
        totalDetail: data.total,
      },
    })
  } else if (typeof failedCallback === 'function') failedCallback()

  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export default function* rootSaga() {
  yield all([takeLatest(actions.LOAD, LOAD), takeLatest(actions.LOAD_DETAIL, LOAD_DETAIL)])
}
