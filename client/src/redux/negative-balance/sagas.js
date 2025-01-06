import { all, call, put, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/negative-balance'
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

export function* EXPORT({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingExport: true } })
  const response = yield call(svc.LoadTable, payload, source)
  if (response) {
    const { data } = response
    const title = ['Username', 'Currency', 'Current Balance']
    const dataNew = data.result.map(e => ({
      username: e.username,
      bet_id: e.currency,
      bet_date: e.current_balance,
    }))
    Download(title, dataNew, `Negative Balance`)
  }
  yield put({ type: actions.SET_STATE, payload: { loadingExport: false } })
}

export default function* rootSaga() {
  yield all([takeLatest(actions.LOAD_TABLE, LOAD_TABLE), takeLatest(actions.EXPORT, EXPORT)])
}
