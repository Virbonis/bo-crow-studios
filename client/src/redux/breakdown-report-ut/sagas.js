import { all, put, call, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/breakdown-report-ut'
import actions from './actions'

export function* LOAD_BREAKDOWN_REPORT_UT({ payload, failedCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { [`loadingData${payload.hist_or_post}`]: true } })
  const response = yield call(svc.LoadBreakdownReportUT, payload, source)
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

export default function* rootSaga() {
  yield all([takeLatest(actions.LOAD_BREAKDOWN_REPORT_UT, LOAD_BREAKDOWN_REPORT_UT)])
}
