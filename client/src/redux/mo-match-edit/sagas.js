import { all, put, call, select, takeLeading, takeLatest, takeEvery } from 'redux-saga/effects'
import * as svc from 'services/mo-match-edit'
import * as svcSpecialCode from 'services/special-code'
import actions from './actions'

export function OPEN_EDIT({ payload }) {
  const { match_id, display_admin, game_type, sport_id, home_name, away_name, page } = payload
  const title = `${match_id} - ${home_name} - ${away_name}`
  const qs = {
    match_id,
    display_admin,
    game_type,
    sport_id,
    page,
    title,
  }
  window.open(
    `/#/trading/mo-match-edit-fly?${new URLSearchParams(qs).toString()}`,
    `MatchEdit-${match_id}`,
    'height=750,width=1500,scrollbars=no',
  )
}

export function* LOAD_MATCH({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadMatch, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        data,
      },
    })

    if (data.match) {
      // reload select special_code
      const editValue = yield select(state => state.moEdit.editValue)
      const special_code = yield select(state => state.moEdit.special_code)
      if (special_code.length === 0 || data.match.match_id !== editValue.match_id) {
        yield put({
          type: actions.LOAD_SPECIAL_CODE,
          payload: {
            sport_id: data.match.sport_id,
          },
        })
      }
    }
  }

  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}
function* RELOAD_MATCH() {
  const editValue = yield select(state => state.moEdit.editValue)
  yield put({ type: actions.LOAD_MATCH, payload: editValue })
}

export function* LOAD_SPECIAL_CODE({ payload, source }) {
  const response = yield call(svcSpecialCode.LoadBySport, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        special_code: data,
      },
    })
  }
}

export function* UPDATE_MATCH({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateMatch, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
    yield RELOAD_MATCH()
  }
}

export function* UPDATE_PROFILE({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateProfile, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
    yield RELOAD_MATCH()
  }
}
export function* UPDATE_SPORTS_TICKER({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateSportsTicker, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
    yield RELOAD_MATCH()
  }
}
export function* UPDATE_SPORTS_TICKER_CS({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateSportsTickerCS, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
    yield RELOAD_MATCH()
  }
}
export function* UPDATE_SPORTS_TICKER_OE({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateSportsTickerOE, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
    yield RELOAD_MATCH()
  }
}
export function* UPDATE_MATCH_PARLAY({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateMatchParlay, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
    yield RELOAD_MATCH()
  }
}
export function* UPDATE_ODDS_POINT_DIFF({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateOddsPointDiff, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
    yield RELOAD_MATCH()
  }
}
export function* UPDATE_PARLAY({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateParlay, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
    yield RELOAD_MATCH()
  }
}

export function* UPDATE_RBDelay({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateRBDelay, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
    yield RELOAD_MATCH()
  }
}

export function* UPDATE_LINK_ODDS({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateLinkOdds, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
    yield RELOAD_MATCH()
  }
}
export function* UPDATE_TIMED_MAX_BET({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateTimedMaxBet, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
    yield RELOAD_MATCH()
  }
}
export function* UPDATE_MATCH_LIVE_STATUS({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateMatchLiveStatus, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
    yield RELOAD_MATCH()
  }
}
export function* UPDATE_FIX_MARKET({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateFixMarket, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
    yield RELOAD_MATCH()
  }
}
export function* UPDATE_AUTO_PROCESS_BETBAZAR({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateAutoProcessBetBazar, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
    yield RELOAD_MATCH()
  }
}
export function* UPDATE_AUTO_PROCESS_IM({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateAutoProcessIM, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
    yield RELOAD_MATCH()
  }
}
export function* UPDATE_PROFILE_GAMETYPE({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateProfileGameType, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
    yield RELOAD_MATCH()
  }
}
export function* UPDATE_ET_PEN({ payload, successCallback, source }) {
  if (payload.st_et) {
    const response = yield call(svc.UpdateMatchET, payload, source)
    if (response) {
      if (typeof successCallback === 'function') successCallback()
      yield RELOAD_MATCH()
    }
  }
  if (payload.st_pen) {
    const response = yield call(svc.UpdateMatchPEN, payload, source)
    if (response) {
      if (typeof successCallback === 'function') successCallback()
      yield RELOAD_MATCH()
    }
  }
}
export function* ADD_PENALTY_SHOOT_OUT({ payload, successCallback, source }) {
  const response = yield call(svc.AddPenaltyShootOut, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
    yield RELOAD_MATCH()
  }
}
export function* ADD_SUB_MATCH({ payload, successCallback, source }) {
  const response = yield call(svc.AddSubMatch, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
    yield RELOAD_MATCH()
  }
}
export function* DELETE_SUB_MATCH({ payload, successCallback, source }) {
  const response = yield call(svc.DeleteSubMatch, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
    yield RELOAD_MATCH()
  }
}
export default function* rootSaga() {
  yield all([
    takeEvery(actions.OPEN_EDIT, OPEN_EDIT),
    takeLatest(actions.LOAD_MATCH, LOAD_MATCH),
    takeLeading(actions.UPDATE_MATCH, UPDATE_MATCH),
    takeLatest(actions.LOAD_SPECIAL_CODE, LOAD_SPECIAL_CODE),
    takeLeading(actions.UPDATE_PROFILE, UPDATE_PROFILE),
    takeLeading(actions.UPDATE_SPORTS_TICKER, UPDATE_SPORTS_TICKER),
    takeLeading(actions.UPDATE_SPORTS_TICKER_CS, UPDATE_SPORTS_TICKER_CS),
    takeLeading(actions.UPDATE_SPORTS_TICKER_OE, UPDATE_SPORTS_TICKER_OE),
    takeLeading(actions.UPDATE_MATCH_PARLAY, UPDATE_MATCH_PARLAY),
    takeLeading(actions.UPDATE_ODDS_POINT_DIFF, UPDATE_ODDS_POINT_DIFF),
    takeLeading(actions.UPDATE_PARLAY, UPDATE_PARLAY),
    takeLeading(actions.UPDATE_RBDelay, UPDATE_RBDelay),
    takeLeading(actions.UPDATE_LINK_ODDS, UPDATE_LINK_ODDS),
    takeLeading(actions.UPDATE_TIMED_MAX_BET, UPDATE_TIMED_MAX_BET),
    takeLeading(actions.UPDATE_MATCH_LIVE_STATUS, UPDATE_MATCH_LIVE_STATUS),
    takeLeading(actions.UPDATE_FIX_MARKET, UPDATE_FIX_MARKET),
    takeLeading(actions.UPDATE_AUTO_PROCESS_BETBAZAR, UPDATE_AUTO_PROCESS_BETBAZAR),
    takeLeading(actions.UPDATE_AUTO_PROCESS_IM, UPDATE_AUTO_PROCESS_IM),
    takeLeading(actions.UPDATE_PROFILE_GAMETYPE, UPDATE_PROFILE_GAMETYPE),
    takeLeading(actions.UPDATE_ET_PEN, UPDATE_ET_PEN),
    takeLeading(actions.ADD_PENALTY_SHOOT_OUT, ADD_PENALTY_SHOOT_OUT),
    takeLeading(actions.ADD_SUB_MATCH, ADD_SUB_MATCH),
    takeLeading(actions.DELETE_SUB_MATCH, DELETE_SUB_MATCH),
  ])
}
