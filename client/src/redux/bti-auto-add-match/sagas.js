import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/bti-auto-add-match'
import actions from './actions'

function* LOAD_SELECT_LEAGUE({ payload, source }) {
  yield all([
    LOAD_SELECT_LEAGUE_UNMAPPED({ payload, source }),
    LOAD_SELECT_LEAGUE_MAPPED({ payload, source }),
  ])
}
function* LOAD_SELECT_LEAGUE_UNMAPPED({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading_league_unmapped: true } })

  payload = {
    ...payload,
    mapping_status: 0,
  }
  const response = yield call(svc.LoadSelectLeague, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        select_league_unmapped: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading_league_unmapped: false } })
}
function* LOAD_SELECT_LEAGUE_MAPPED({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading_league_mapped: true } })

  payload = {
    ...payload,
    mapping_status: 1,
  }
  const response = yield call(svc.LoadSelectLeague, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        select_league_mapped: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading_league_mapped: false } })
}

export function* LOAD_UNMAPPED({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading_unmapped: true } })
  const response = yield call(svc.LoadMatchBTI, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        data_unmapped: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading_unmapped: false } })
}
export function* LOAD_MAPPED({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading_mapped: true } })
  const response = yield call(svc.LoadMatchBTI, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        data_mapped: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading_mapped: false } })
}

export function* INSERT_MATCH({ payload, successCallback, source }) {
  const response = yield call(svc.InsertMatchBTI, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_SELECT_LEAGUE, LOAD_SELECT_LEAGUE),
    takeLatest(actions.LOAD_UNMAPPED, LOAD_UNMAPPED),
    takeLatest(actions.LOAD_MAPPED, LOAD_MAPPED),
    takeLeading(actions.INSERT_MATCH, INSERT_MATCH),
  ])
}
