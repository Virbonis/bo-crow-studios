import convertDataEventLimit from 'helper/convert-data-event-limit'
import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import { RetryPreload } from 'redux/preload-state'
import * as svc from 'services/profile'
import actions from './actions'

export function* PRELOAD({ source }) {
  const response = yield RetryPreload(svc.LoadSelect, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        select: data,
      },
    })
  }
}

export function* LOAD({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingItem: true } })
  const response = yield call(svc.LoadSelect, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        select: data,
      },
    })
    yield put({
      type: actions.LOAD_DATA,
      payload: {
        profile_id: payload.selectedValue,
        soccer_os: `''`,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingItem: false } })
}

export function* LOAD_DATA({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.LoadData, payload, source)
  if (response) {
    const { status, data } = response
    const eventLimit = convertDataEventLimit(data.result_event_limit)
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        dataEventLimit: eventLimit,
        dataPayout: data.result_payout,
        dataPayoutSpec: data.result_payout_spec,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
}

export function* CREATE({ payload, successCallback, source }) {
  const response = yield call(svc.Create, payload, source)
  if (response) {
    yield PRELOAD({ source })
    successCallback()
  }
}

export function* DELETE({ payload, successCallback, source }) {
  const response = yield call(svc.Delete, payload, source)
  if (response) {
    yield PRELOAD({ source })
    successCallback()
  }
}

export function* UPDATE({ payload, successCallback, source }) {
  const response = yield call(svc.Update, payload, source)
  if (response) {
    successCallback()
  }
}

export function* UPDATE_PAYOUT({ payload, successCallback, source }) {
  const response = yield call(svc.UpdatePayout, payload, source)
  if (response) {
    successCallback()
  }
}

export function* UPDATE_PAYOUT_SPEC({ payload, successCallback, source }) {
  const response = yield call(svc.UpdatePayoutSpec, payload, source)
  if (response) {
    successCallback()
  }
}

export function* LOAD_ODDS_TRIGGER({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingOddsTrigger: true } })
  const response = yield call(svc.LoadOddsTrigger, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        dataOddsTrigger: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingOddsTrigger: false } })
}

export function* ADD_ODDS_TRIGGER({ payload, successCallback, source }) {
  const response = yield call(svc.AddOddsTrigger, payload, source)
  if (response) {
    successCallback()
  }
}

export function* UPDATE_ODDS_TRIGGER({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateOddsTrigger, payload, source)
  if (response) {
    successCallback()
  }
}

export function* DELETE_ODDS_TRIGGER({ payload, successCallback, source }) {
  const response = yield call(svc.DeleteOddsTrigger, payload, source)
  if (response) {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_DATA, LOAD_DATA),
    takeLatest(actions.PRELOAD, PRELOAD),
    takeLatest(actions.LOAD, LOAD),
    takeLeading(actions.CREATE, CREATE),
    takeLatest(actions.DELETE, DELETE),

    takeLeading(actions.UPDATE, UPDATE),
    takeLeading(actions.UPDATE_PAYOUT, UPDATE_PAYOUT),
    takeLeading(actions.UPDATE_PAYOUT_SPEC, UPDATE_PAYOUT_SPEC),

    takeLatest(actions.LOAD_ODDS_TRIGGER, LOAD_ODDS_TRIGGER),
    takeLeading(actions.ADD_ODDS_TRIGGER, ADD_ODDS_TRIGGER),
    takeLeading(actions.UPDATE_ODDS_TRIGGER, UPDATE_ODDS_TRIGGER),
    takeLeading(actions.DELETE_ODDS_TRIGGER, DELETE_ODDS_TRIGGER),
  ])
}
