import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/operator-seamless'
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
export function* CREATE({ payload, source, successCallback }) {
  const response = yield call(svc.Create, payload, source)
  if (response && successCallback && typeof successCallback === 'function') {
    successCallback()
  }
}

export function* LOAD_CONFIG({ payload, source }) {
  const loadingKey = `loadingConfig_${payload.operator_id}`
  const dataKey = `dataConfig_${payload.operator_id}`

  yield put({ type: actions.SET_STATE, payload: { [loadingKey]: true } })
  const response = yield call(svc.LoadConfig, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        [dataKey]: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { [loadingKey]: false } })
}
export function* CREATE_CONFIG({ payload, source, successCallback }) {
  const response = yield call(svc.CreateConfig, payload, source)
  if (response && successCallback && typeof successCallback === 'function') {
    successCallback()
  }
}
export function* UPDATE_CONFIG({ payload, source, successCallback }) {
  const response = yield call(svc.UpdateConfig, payload, source)
  if (response && successCallback && typeof successCallback === 'function') {
    successCallback()
  }
}
export function* DELETE_CONFIG({ payload, source, successCallback }) {
  const response = yield call(svc.DeleteConfig, payload, source)
  if (response && successCallback && typeof successCallback === 'function') {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD, LOAD),
    takeLeading(actions.CREATE, CREATE),
    takeLatest(actions.LOAD_CONFIG, LOAD_CONFIG),
    takeLeading(actions.CREATE_CONFIG, CREATE_CONFIG),
    takeLeading(actions.UPDATE_CONFIG, UPDATE_CONFIG),
    takeLeading(actions.DELETE_CONFIG, DELETE_CONFIG),
  ])
}
