import { all, call, put, takeEvery, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/basket-timer'
import actions from './actions'

export function* LOAD_DATA({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.Load, payload, source)
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

export function* UPDATE_BASKET_TIMER({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateBasketTimer, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}

export function* UPDATE_ADJUST_BASKET_TIMER({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateAdjustBasketTimer, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOAD_DATA, LOAD_DATA),
    takeLeading(actions.UPDATE_BASKET_TIMER, UPDATE_BASKET_TIMER),
    takeLeading(actions.UPDATE_ADJUST_BASKET_TIMER, UPDATE_ADJUST_BASKET_TIMER),
  ])
}
