import { all, call, put, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/mapping-league'
import actions from './actions'

export function* LOAD_TABLE({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.LoadTable, payload, source)
  if (response) {
    const { data, status } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        data: data.result,
        totalData: data.total,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
}

export function* UPDATE({ payload, source, successCallback }) {
  const response = yield call(svc.Update, payload, source)
  if (response) {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([takeLatest(actions.LOAD_TABLE, LOAD_TABLE), takeLeading(actions.UPDATE, UPDATE)])
}
