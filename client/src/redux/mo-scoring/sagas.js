import { all, call, put, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/mo-scoring'
import actions from './actions'

export function* UPDATE_SCORE_MATCH({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateScoreMatch, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}

export function* GET_FINAL_SCORE({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.GetFinalScore, payload, source)
  if (response) {
    const { data, status } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        data,
        status,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export default function* rootSaga() {
  yield all([
    takeLeading(actions.UPDATE_SCORE_MATCH, UPDATE_SCORE_MATCH),
    takeLatest(actions.GET_FINAL_SCORE, GET_FINAL_SCORE),
  ])
}
