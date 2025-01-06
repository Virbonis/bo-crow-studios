import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/match-live-stream'
import actions from './actions'

export function* LOAD_MATCH_LIVE_STREAM({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadMatchLiveStream, payload, source)
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
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export function* UPDATE_MATCH_LIVE_STREAM({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateMatchLiveStream, payload, source)
  if (response) {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_MATCH_LIVE_STREAM, LOAD_MATCH_LIVE_STREAM),
    takeLeading(actions.UPDATE_MATCH_LIVE_STREAM, UPDATE_MATCH_LIVE_STREAM),
  ])
}
