import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/list-cancel-game'
import actions from './actions'

export function* LOAD_CANCEL_GAME({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadCancelGame, payload, source)
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

export function* RESET_CANCEL_GAME({ payload, successCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.ResetCancelGame, payload, source)
  if (response) {
    yield put({ type: actions.SET_STATE, payload: { loading: false } })
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_CANCEL_GAME, LOAD_CANCEL_GAME),
    takeLeading(actions.RESET_CANCEL_GAME, RESET_CANCEL_GAME),
  ])
}
