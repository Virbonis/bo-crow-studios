import { all, put, call, takeLatest, takeEvery, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/popular-pick'
import * as svcMatchList from 'services/match-list'
import actions from './actions'

export function* LOAD_CATEGORY({ source }) {
  const response = yield call(svc.LoadCategory, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        dataCategory: data,
      },
    })
  }
}

export function* LOAD({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.Load, payload, source)
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
export function* LOAD_MATCH_LIST({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingMatchList: true } })
  const response = yield call(svcMatchList.LoadData, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        dataMatchList: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingMatchList: false } })
}
export function* CREATE({ payload, successCallback, source }) {
  const response = yield call(svc.Create, payload, source)
  if (response) {
    successCallback()
  }
}
export function* DELETE({ payload, successCallback, source }) {
  const response = yield call(svc.Delete, payload, source)
  if (response) {
    successCallback()
  }
}
export function* DELETE_FINISHED({ payload, successCallback, source }) {
  const response = yield call(svc.DeleteFinished, payload, source)
  if (response) {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOAD_CATEGORY, LOAD_CATEGORY),
    takeLatest(actions.LOAD, LOAD),
    takeLatest(actions.LOAD_MATCH_LIST, LOAD_MATCH_LIST),
    takeLeading(actions.CREATE, CREATE),
    takeLeading(actions.DELETE, DELETE),
    takeLeading(actions.DELETE_FINISHED, DELETE_FINISHED),
  ])
}
