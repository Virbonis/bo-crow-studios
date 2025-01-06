import { all, put, call, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/bet-list'
import actions from './actions'

export function* LOAD_MATCH({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadMatch, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export function* GET_FORECAST({ payload, successCallback, source }) {
  const response = yield call(svc.GetForecast, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback(response.data)
  }
}
export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_MATCH, LOAD_MATCH),
    takeLatest(actions.GET_FORECAST, GET_FORECAST),
  ])
}
