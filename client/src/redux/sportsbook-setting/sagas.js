import { all, call, put, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/sportsbook-setting'
import actions from './actions'

export function* LOAD() {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })

  yield all([call(LOAD_SETTING), call(LOAD_DEFAULT_MATCH_OUTRIGHT)])

  yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
}

export function* LOAD_SETTING() {
  const response = yield call(svc.Load)
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
export function* LOAD_DEFAULT_MATCH_OUTRIGHT() {
  const response = yield call(svc.LoadDefaultMatchOutright)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        tableData: data,
      },
    })
  }
}

export function* UPDATE_SPORTSBOOK_SETTING({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateSportsbookSetting, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}

export function* UPDATE_DEFAULT_MATCH_OUTRIGHT({ payload, successCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { [`loading${payload.submitType}`]: true } })
  const response = yield call(svc.UpdateDefaultMatchOutright, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
  yield put({ type: actions.SET_STATE, payload: { [`loading${payload.submitType}`]: false } })
}

export function* UPDATE_MAINTENANCE_STATUS({ payload, successCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.UpdateMaintenanceStatus, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
  yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
}

export function* UPDATE_SEAMLESS_MAINTENANCE_STATUS({ payload, successCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.UpdateSeamlessMaintenanceStatus, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
  yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
}

export function* UPDATE_CLOSE_FUND_TRANSFER_STATUS({ payload, successCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.UpdateCloseFundTransferStatus, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
  yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
}

export function* UPDATE_BET_BAZAR_STATUS({ payload, successCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.UpdateBetBazarStatus, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
  yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
}

export function* UPDATE_IM_STATUS({ payload, successCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.UpdateIMStatus, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
  yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
}
export function* UPDATE_SIS_STATUS({ payload, successCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.UpdateSISStatus, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
  yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
}
export function* UPDATE_BTI_AUTO_ADD_MATCH({ payload, successCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.UpdateBTIAutoAddMatch, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
  yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD, LOAD),
    takeLeading(actions.UPDATE_SPORTSBOOK_SETTING, UPDATE_SPORTSBOOK_SETTING),
    takeLeading(actions.UPDATE_DEFAULT_MATCH_OUTRIGHT, UPDATE_DEFAULT_MATCH_OUTRIGHT),
    takeLeading(actions.UPDATE_MAINTENANCE_STATUS, UPDATE_MAINTENANCE_STATUS),
    takeLeading(actions.UPDATE_SEAMLESS_MAINTENANCE_STATUS, UPDATE_SEAMLESS_MAINTENANCE_STATUS),
    takeLeading(actions.UPDATE_CLOSE_FUND_TRANSFER_STATUS, UPDATE_CLOSE_FUND_TRANSFER_STATUS),
    takeLeading(actions.UPDATE_BET_BAZAR_STATUS, UPDATE_BET_BAZAR_STATUS),
    takeLeading(actions.UPDATE_IM_STATUS, UPDATE_IM_STATUS),
    takeLeading(actions.UPDATE_SIS_STATUS, UPDATE_SIS_STATUS),
    takeLeading(actions.UPDATE_BTI_AUTO_ADD_MATCH, UPDATE_BTI_AUTO_ADD_MATCH),
  ])
}
