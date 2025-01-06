import { all, put, call, takeLatest, takeEvery, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/outright'
import actions from './actions'

export function* CREATE_OUTRIGHT({ payload, successCallback, source }) {
  const response = yield call(svc.CreateOutright, payload, source)
  if (response) {
    successCallback(response)
  }
}

export function* LOAD_OUTRIGHT({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.LoadOutright, payload, source)
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
  yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
}

export function* LOAD_OUTRIGHT_TEAM({ payload, source }) {
  const key = payload?.outright_id
  yield put({ type: actions.SET_STATE, payload: { [`loadingList_${key}`]: true } })
  const response = yield call(svc.LoadOutrightTeam, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        [`dataList_${key}`]: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { [`loadingList_${key}`]: false } })
}

export function* LOAD_EDIT_OUTRIGHT({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.LoadEditOutright, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        dataEdit: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
}
export function* UPDATE_EDIT_OUTRIGHT({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateEditOutright, payload, source)
  if (response) {
    successCallback()
  }
}

export function* DELETE_OUTRIGHT({ payload, successCallback, source }) {
  const response = yield call(svc.DeleteOutright, payload, source)
  if (response) {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLeading(actions.CREATE_OUTRIGHT, CREATE_OUTRIGHT),
    takeLatest(actions.LOAD_OUTRIGHT, LOAD_OUTRIGHT),
    takeLatest(actions.LOAD_OUTRIGHT_TEAM, LOAD_OUTRIGHT_TEAM),
    takeLatest(actions.LOAD_EDIT_OUTRIGHT, LOAD_EDIT_OUTRIGHT),
    takeLeading(actions.UPDATE_EDIT_OUTRIGHT, UPDATE_EDIT_OUTRIGHT),
    takeEvery(actions.DELETE_OUTRIGHT, DELETE_OUTRIGHT),
  ])
}
