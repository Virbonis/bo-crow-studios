import { all, put, call, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/winloss-for-cash'
import actions from './actions'

export function* LOAD_TABLE({ payload, failedCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { [`loadingData${payload.hist_or_post}`]: true } })
  const response = yield call(svc.LoadTable, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        [`data${payload.hist_or_post}`]: data.result,
        [`total${payload.hist_or_post}`]: data.total,
        [`summary${payload.hist_or_post}`]: data.summary,

        // // clear data detail
        [`dataDetail${payload.hist_or_post}`]: [],
        [`totalDetail${payload.hist_or_post}`]: 0,
      },
    })
  } else if (typeof failedCallback === 'function') failedCallback()
  yield put({ type: actions.SET_STATE, payload: { [`loadingData${payload.hist_or_post}`]: false } })
}

export function* LOAD_TABLE_DETAIL({ payload, failedCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { [`loadingData${payload.hist_or_post}`]: true } })
  const response = yield call(svc.LoadTableDetail, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        [`dataDetail${payload.hist_or_post}`]: data.result,
        [`totalDetail${payload.hist_or_post}`]: data.total,
        [`summaryDetail${payload.hist_or_post}`]: data.summary,
      },
    })
  } else if (typeof failedCallback === 'function') failedCallback()
  yield put({ type: actions.SET_STATE, payload: { [`loadingData${payload.hist_or_post}`]: false } })
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_TABLE, LOAD_TABLE),
    takeLatest(actions.LOAD_TABLE_DETAIL, LOAD_TABLE_DETAIL),
  ])
}
