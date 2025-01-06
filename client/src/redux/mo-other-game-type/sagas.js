import { all, call, put, select, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/mo-other-game-type'
// import { LoadMatch } from 'services/mo-match-edit'
import { LOAD_MATCH } from 'redux/mo-match-edit/sagas'
import { GET_STATUS } from 'redux/auto-add-sub-match-more/sagas'
import actions from './actions'

export function* LOAD_DATA({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })

  const moEditData = yield select(state => state.moEdit.data)
  if (moEditData.match?.match_id !== payload.match_id) yield LOAD_MATCH({ payload, source })
  yield GET_STATUS({ payload, source })

  const { sport_id } = payload
  if (sport_id !== 12 && sport_id !== 58) {
    yield LOAD_MORE_OE({ payload, source })
    yield LOAD_MORE_WNW({ payload, source })
    yield LOAD_MORE_SPECIAL({ payload, source })
    yield LOAD_MORE_CS({ payload, source })
  } else {
    yield LOAD_MORE_BASKETBALL({ payload, source })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}
function* LOAD_MORE_OE({ payload, source }) {
  const response = yield call(svc.LoadMoreOE, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        list_oe: data,
      },
    })
  }
}
function* LOAD_MORE_WNW({ payload, source }) {
  const response = yield call(svc.LoadMoreWNW, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        list_wnw: data,
      },
    })
  }
}
function* LOAD_MORE_SPECIAL({ payload, source }) {
  const response = yield call(svc.LoadMoreSpecial, payload, source)
  if (response) {
    const { data } = response
    const { GT, ...other } = data
    yield put({
      type: actions.SET_STATE,
      payload: {
        list_special_gt: GT,
        list_special_other: Object.entries(other).reduce((curr, [, arr]) => [...curr, ...arr], []),
      },
    })
  }
}
function* LOAD_MORE_CS({ payload, source }) {
  const response = yield call(svc.LoadMoreCS, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        list_cs: data,
      },
    })
  }
}

function* LOAD_MORE_BASKETBALL({ payload, source }) {
  const { game_type } = payload
  const loadingKey = `loadingData_${game_type}`
  const dataKey = `data_${game_type}`
  yield put({ type: actions.SET_STATE, payload: { [loadingKey]: true } })
  const response = yield call(svc.LoadMoreBasketball, payload, source)
  if (response) {
    const { data } = response
    const finalData = Object.entries(data)
      .map(([key, val]) => ({ key, data: val }))
      .filter(e => e.data.length > 0)
    yield put({
      type: actions.SET_STATE,
      payload: {
        [dataKey]: finalData,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { [loadingKey]: false } })
}

export function* UPDATE_MORE_GAME_TYPE({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateMoreGameType, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}
export function* UPDATE_MORE_GAME_TYPE_BASKETBALL({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateMoreGameTypeBasketball, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}
export function* UPDATE_MORE_STATUS_BG_ALL({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateMoreStatusBGAll, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}
export function* UPDATE_MORE_STATUS_OPEN_ALL({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateMoreStatusOpenAll, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}
export function* UPDATE_MORE_STATUS_PAUSE_ALL({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateMoreStatusPauseAll, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}
export function* UPDATE_MORE_STATUS_BG({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateMoreStatusBG, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}
export function* UPDATE_MORE_STATUS_PARLAY({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateMoreStatusParlay, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}
export function* UPDATE_MORE_STATUS_OPEN({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateMoreStatusOpen, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}
export function* UPDATE_MORE_STATUS_PAUSE({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateMoreStatusPause, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_DATA, LOAD_DATA),
    takeLatest(actions.LOAD_MORE_BASKETBALL, LOAD_MORE_BASKETBALL),
    takeLeading(actions.UPDATE_MORE_GAME_TYPE, UPDATE_MORE_GAME_TYPE),
    takeLeading(actions.UPDATE_MORE_GAME_TYPE_BASKETBALL, UPDATE_MORE_GAME_TYPE_BASKETBALL),
    takeLeading(actions.UPDATE_MORE_STATUS_BG_ALL, UPDATE_MORE_STATUS_BG_ALL),
    takeLeading(actions.UPDATE_MORE_STATUS_OPEN_ALL, UPDATE_MORE_STATUS_OPEN_ALL),
    takeEvery(actions.UPDATE_MORE_STATUS_PAUSE_ALL, UPDATE_MORE_STATUS_PAUSE_ALL),
    takeLeading(actions.UPDATE_MORE_STATUS_BG, UPDATE_MORE_STATUS_BG),
    takeLeading(actions.UPDATE_MORE_STATUS_PARLAY, UPDATE_MORE_STATUS_PARLAY),
    takeLeading(actions.UPDATE_MORE_STATUS_OPEN, UPDATE_MORE_STATUS_OPEN),
    takeLeading(actions.UPDATE_MORE_STATUS_PAUSE, UPDATE_MORE_STATUS_PAUSE),
  ])
}
