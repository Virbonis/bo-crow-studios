import { all, put, call, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/member-winloss'
import actions from './actions'

export function* LOAD_TABLE({ payload, failedCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { [`loading${payload.hist_or_post}`]: true } })
  const response = yield call(svc.LoadTable, payload, source)
  if (response) {
    const { status, data } = response
    const newData = data.result.map((e, index) => ({ ...e, key: index }))
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        [`data${payload.hist_or_post}`]: newData,
        [`dataTotal${payload.hist_or_post}`]: data.total,
        [`dataResultHeader${payload.hist_or_post}`]: data.result_header,
      },
    })
  } else if (typeof failedCallback === 'function') failedCallback()
  yield put({ type: actions.SET_STATE, payload: { [`loading${payload.hist_or_post}`]: false } })
}

export function* LOAD_TABLE_DETAIL({ payload, source }) {
  yield put({
    type: actions.SET_STATE,
    payload: { [`loadingDetail${payload.hist_or_post}`]: true },
  })
  const response = yield call(svc.LoadTableDetail, payload, source)
  if (response) {
    const { status, data } = response
    const newData = data.result.map((e, index) => ({ ...e, key: index }))
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        [`betDetailData${payload.hist_or_post}`]: newData,
        [`betDetailTotal${payload.hist_or_post}`]: data.total,
        [`betDetailSummary${payload.hist_or_post}`]: data.summary,
      },
    })
  }
  yield put({
    type: actions.SET_STATE,
    payload: { [`loadingDetail${payload.hist_or_post}`]: false },
  })
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_TABLE, LOAD_TABLE),
    takeLatest(actions.LOAD_TABLE_DETAIL, LOAD_TABLE_DETAIL),
  ])
}
