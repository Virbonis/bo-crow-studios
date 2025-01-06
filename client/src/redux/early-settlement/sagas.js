import { all, call, put, takeEvery, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/early-settlement'
import { LoadMatch } from 'services/mo-match-edit'
import actions from './actions'

export function* LOAD_DATA({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })

  yield LOAD_MATCH({ payload, source })
  yield LOAD_EARLY_SETTLEMENT({ payload, source })

  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

function* LOAD_MATCH({ payload, source }) {
  const response = yield call(LoadMatch, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        data,
      },
    })
  }
}
export function* LOAD_EARLY_SETTLEMENT({ payload, source }) {
  const response = yield call(svc.Load, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        list: data,
      },
    })
  }
}

export function* UPDATE_EARLY_SETTLEMENT({ payload, successCallback }) {
  const response = yield call(svc.Update, payload)
  if (response) {
    if (typeof successCallback === 'function') successCallback(response.data)
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOAD_DATA, LOAD_DATA),
    takeEvery(actions.LOAD_EARLY_SETTLEMENT, LOAD_EARLY_SETTLEMENT),
    takeLeading(actions.UPDATE_EARLY_SETTLEMENT, UPDATE_EARLY_SETTLEMENT),
  ])
}
