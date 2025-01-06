import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/admin/application'
import actions from './actions'

export function* LOAD({ source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.Load, source)
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

export function* CREATE({ payload, successCallback, source }) {
  const response = yield call(svc.Create, payload, source)
  if (response) {
    successCallback()
  }
}

export function* UPDATE({ payload, successCallback, source }) {
  const response = yield call(svc.Update, payload, source)
  if (response) {
    successCallback()
  }
}

function* GET_MENU({ payload, source }) {
  const response = yield call(svc.GetMenu, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        menu: data,
      },
    })
  }
}
function* UPDATE_MENU({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateMenu, payload, source)
  if (response) {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD, LOAD),
    takeLeading(actions.CREATE, CREATE),
    takeLeading(actions.UPDATE, UPDATE),
    takeLatest(actions.GET_MENU, GET_MENU),
    takeLeading(actions.UPDATE_MENU, UPDATE_MENU),
  ])
}
