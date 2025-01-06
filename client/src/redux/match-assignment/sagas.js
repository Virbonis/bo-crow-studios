import { all, put, call, takeLatest, takeLeading, select } from 'redux-saga/effects'
import * as svc from 'services/match-assignment'
import actions from './actions'

export function* LOAD_TRADER({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingTrader: true } })
  const response = yield call(svc.LoadTraders, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        traders: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingTrader: false } })
}
export function* LOAD_COUNTER({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingCounter: true } })

  // using same api as my-matches but with trader_name
  const response = yield call(svc.LoadCounterMyMatches, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        dataCounter: [
          { match_time_slot: 'Live', counter: data.total_live },
          { match_time_slot: 'Today', counter: data.total_today },
          { match_time_slot: 'Early', counter: data.total_early },
          { match_time_slot: 'Started', counter: data.total_started },
          { match_time_slot: 'Outright', counter: data.total_outright },
          {
            match_time_slot: 'Total All',
            counter:
              data.total_live +
              data.total_today +
              data.total_early +
              data.total_started +
              data.total_outright,
          },
        ],
      },
    })
  }

  yield put({ type: actions.SET_STATE, payload: { loadingCounter: false } })
}

export function* LOAD_LEAGUE({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingLeague: true } })
  const response = yield call(svc.LoadLeague, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        dataLeague: data,
        defaultSelectedLeague: data.filter(x => x.is_selected === 'Y').map(x => x.league_id),
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingLeague: false } })
}

export function* LOAD_LEAGUE_RO({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingLeague: true } })
  const response = yield call(svc.LoadLeagueRO, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        dataLeague: data,
        defaultSelectedLeague: data.filter(x => x.is_selected === 'Y').map(x => x.league_id),
      },
    })
    const leagueIDs = yield select(state => state.matchAssignment.defaultSelectedLeague)
    yield LOAD_MATCH_RO({ payload: { league_ids: leagueIDs.toString() }, source })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingLeague: false } })
}

export function* LOAD_MATCH({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingMatch: true } })
  const response = yield call(svc.LoadMatch, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        dataMatch: data,
        defaultSelectedMatch: data
          .map(e => ({
            match_id: e.match_id,
            match_time_slot: e.match_time_slot,
            ...isCheckedRB(e.rb_htft),
          }))
          .filter(e => e.rb_ht || e.rb_ft),
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingMatch: false } })
}

export function* LOAD_MATCH_PICK({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingMatch: true } })
  const response = yield call(svc.LoadMatchPick, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        dataMatch: data,
        defaultSelectedMatch: data
          .map(e => ({
            match_id: e.match_id,
            match_time_slot: e.match_time_slot,
            ...isCheckedDB(e.db_htft),
            ...isCheckedRB(e.rb_htft),
          }))
          .filter(e => e.db_ht || e.db_ft || e.rb_ht || e.rb_ft),
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingMatch: false } })
}

export function* LOAD_MATCH_RO({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingMatch: true } })
  const response = yield call(svc.LoadMatchRO, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        dataMatch: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingMatch: false } })
}

export function* LOAD_DETAIL({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingDetail: true } })
  const response = yield call(svc.LoadDetail, payload, source)
  if (response) {
    const { data } = response

    yield put({
      type: actions.SET_STATE,
      payload: {
        dataDetail: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingDetail: false } })
}

export function* LOAD_LOG({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingLog: true } })
  const response = yield call(svc.LoadLog, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        dataLog: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingLog: false } })
}

export function* UPDATE_LEAGUE({ payload, successCallback, source }) {
  if (payload.is_ro) {
    yield LOAD_MATCH_RO({ payload, source })
  } else {
    const response = yield call(svc.UpdateLeague, payload, source)
    if (response && typeof successCallback === 'function') successCallback()
  }
}

export function* UPDATE_MATCH({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateMatch, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}

export function* UPDATE_MATCH_PICK({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateMatchPick, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}

export function* UPDATE_DETAIL({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateDetail, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_TRADER, LOAD_TRADER),
    takeLatest(actions.LOAD_COUNTER, LOAD_COUNTER),
    takeLatest(actions.LOAD_LEAGUE, LOAD_LEAGUE),
    takeLatest(actions.LOAD_LEAGUE_RO, LOAD_LEAGUE_RO),
    takeLatest(actions.LOAD_MATCH, LOAD_MATCH),
    takeLatest(actions.LOAD_MATCH_PICK, LOAD_MATCH_PICK),
    takeLatest(actions.LOAD_MATCH_RO, LOAD_MATCH_RO),
    takeLatest(actions.LOAD_DETAIL, LOAD_DETAIL),
    takeLatest(actions.LOAD_LOG, LOAD_LOG),
    takeLeading(actions.UPDATE_LEAGUE, UPDATE_LEAGUE),
    takeLeading(actions.UPDATE_MATCH, UPDATE_MATCH),
    takeLeading(actions.UPDATE_MATCH_PICK, UPDATE_MATCH_PICK),
    takeLeading(actions.UPDATE_DETAIL, UPDATE_DETAIL),
  ])
}

const isCheckedRB = value => {
  switch (value) {
    case 1:
      return { rb_ht: true, rb_ft: false }
    case 2:
      return { rb_ht: false, rb_ft: true }
    case 3:
      return { rb_ht: true, rb_ft: true }
    default:
      return { rb_ht: false, rb_ft: false }
  }
}
const isCheckedDB = value => {
  switch (value) {
    case 1:
      return { db_ht: true, db_ft: false }
    case 2:
      return { db_ht: false, db_ft: true }
    case 3:
      return { db_ht: true, db_ft: true }
    default:
      return { db_ht: false, db_ft: false }
  }
}
