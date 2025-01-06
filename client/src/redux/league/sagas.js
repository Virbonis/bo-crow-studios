import { categoryName, priceGroupName } from 'helper'
import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/league'
import { Download } from 'utils'
import actions from './actions'

export function* LOAD_SELECT({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadSelect, payload, source)
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
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export function* UPDATE_SELECT({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateSelect, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}

export function* UPDATE_SELECT_REFRESH({ payload, successCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingRefresh: true } })
  const response = yield call(svc.UpdateSelectRefresh, payload, source)
  if (response && typeof successCallback === 'function') {
    yield put({ type: actions.SET_STATE, payload: { loadingRefresh: false } })
    successCallback()
  }
}

// export function* LOAD({ source }) {
//   yield put({ type: actions.SET_STATE, payload: { loadingItem: true } })
//   yield LOAD_COMP({ source })
//   // yield LOAD_DATA({ payload, source })
//   yield put({ type: actions.SET_STATE, payload: { loadingItem: false } })
// }

export function* SEARCH({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingSearch: true } })
  const response = yield call(svc.Search, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        dataSearch: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingSearch: false } })
}

export function* LOAD_DATA({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadData, payload, source)
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

export function* LOAD_EXPORT_DATA({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingExport: true } })
  const response = yield call(svc.LoadExportData, payload, source)
  if (response) {
    const { data } = response
    const title = [
      'Is Delete',
      'Sport Name',
      'League ID',
      'League Name',
      'Profile ID',
      'Profile 1X2',
      'Group',
      'Category',
      'Active',
    ]
    const dataNew = data.map(e => ({
      is_delete: e.is_delete || '',
      sport_name: e.sport_name,
      league_id: e.league_id,
      league_name_en: e.league_name_en,
      profile_id: e.profile_id,
      profile1x2: e.profile1x2,
      group_name: priceGroupName[e.price_group],
      category_name: e.category
        .split('^')
        .map(value => categoryName[value])
        .join('; '),
      active: e.active,
    }))
    Download(title, dataNew, `MasterLeague`)
  }
  yield put({ type: actions.SET_STATE, payload: { loadingExport: false } })
}

export function* CREATE({ payload, successCallback, source }) {
  const response = yield call(svc.Create, payload, source)
  if (response) {
    successCallback()
  }
}

export function* UPDATE({ payload, successCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.Update, payload, source)
  if (response) {
    successCallback()
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export function* LOAD_DETAIL({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingDetail: true } })
  const response = yield call(svc.LoadDetail, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        detail: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingDetail: false } })
}

export function* EDIT_PARENT_LEAGUE({ payload, successCallback, source }) {
  const response = yield call(svc.EditParentLeague, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}

export function* EDIT_ODDS_STEP({ payload, successCallback, source }) {
  const response = yield call(svc.EditOddsStep, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}

export function* EDIT_SPREAD_PARLAY({ payload, successCallback, source }) {
  const response = yield call(svc.EditSpreadParlay, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}

export function* EDIT_ODDS_DIFF({ payload, successCallback, source }) {
  const response = yield call(svc.EditOddsDiff, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}

export function* EDIT_1X2_DIFF({ payload, successCallback, source }) {
  const response = yield call(svc.Edit1X2Diff, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}

export function* EDIT_LAP_SHORT({ payload, successCallback, source }) {
  const response = yield call(svc.EditLAPShort, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}
export function* EDIT_AUTO_CLOSE({ payload, successCallback, source }) {
  const response = yield call(svc.EditAutoClose, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}
export function* EDIT_BET_GENIUS({ payload, successCallback, source }) {
  const response = yield call(svc.EditBetGenius, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}
export function* EDIT_TIMED_DIFF({ payload, successCallback, source }) {
  const response = yield call(svc.EditTimedDiff, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}
export function* EDIT_PROFILE_ID({ payload, successCallback, source }) {
  const response = yield call(svc.EditProfileID, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}
export function* EDIT_PROFILE_1X2({ payload, successCallback, source }) {
  const response = yield call(svc.EditProfile1X2, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}
export function* EDIT_1X2_LAP({ payload, successCallback, source }) {
  const response = yield call(svc.Edit1X2LAP, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}
export function* EDIT_SPECIAL_CODE({ payload, successCallback, source }) {
  const response = yield call(svc.EditSpecialCode, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}
export function* EDIT_LEAGUE_GROUP({ payload, successCallback, source }) {
  const response = yield call(svc.EditLeagueGroup, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}

export function* EDIT_REGION({ payload, successCallback, source }) {
  const response = yield call(svc.EditRegion, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}

export function* EDIT_LINK_ODDS_DIFF({ payload, successCallback, source }) {
  const response = yield call(svc.EditLinkOddsDiff, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}

export function* COPY_TO_LOTTERY({ payload, successCallback, source }) {
  const response = yield call(svc.CopyToLottery, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}

export function* LOAD_SELECT_IN_AUTOADDMATCH({ payload, source }) {
  const response = yield call(svc.LoadLeagueAutoAddMatch, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        select_in_autoaddmatch: data,
      },
    })
  }
}
export function* LOAD_SELECT_IN_ADDMATCH({ payload, source }) {
  // searching input
  yield put({ type: actions.SET_STATE, payload: { loadingSearch: true } })
  const response = yield call(svc.LoadLeagueAddMatch, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        select_in_addmatch: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingSearch: false } })
}
export function* LOAD_SELECT_IN_MATCHLIST({ payload, successCallback, source }) {
  const response = yield call(svc.LoadLeagueMatchList, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        select_in_matchlist: data,
      },
    })
    if (typeof successCallback === 'function') successCallback(data)
  }
}
export function* LOAD_SELECT_IN_MAPPING_LOTTERY({ payload, source }) {
  const response = yield call(svc.LoadLeagueMappingLottery, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        select_in_mapping_lottery: data,
      },
    })
  }
}
export function* LOAD_SELECT_IN_MATCH_PROFILE({ payload, source }) {
  const response = yield call(svc.LoadLeagueMatchProfile, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        select_in_match_profile: data,
      },
    })
  }
}
export function* LOAD_SELECT_IN_MATCH_STATISTIC({ payload, source }) {
  const response = yield call(svc.LoadLeagueMatchStatistic, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        select_in_match_statistic: data,
      },
    })
  }
}
export function* LOAD_SELECT_IN_SCORING_MATCH({ payload, source }) {
  const response = yield call(svc.LoadLeagueScoringMatch, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        select_in_scoring_match: data,
      },
    })
  }
}
export function* LOAD_SELECT_IN_PROCESS_MATCH({ payload, source }) {
  const response = yield call(svc.LoadLeagueProcessMatch, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        select_in_process_match: data,
      },
    })
  }
}
export function* LOAD_SELECT_IN_UNPROCESS_MATCH({ payload, source }) {
  const response = yield call(svc.LoadLeagueUnprocessMatch, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        select_in_unprocess_match: data,
      },
    })
  }
}

export function* LOAD_SELECT_IN_OUTRIGHT({ payload, source }) {
  // searching input
  yield put({ type: actions.SET_STATE, payload: { loadingSearch: true } })
  const response = yield call(svc.LoadLeagueAddOutright, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        select_in_outright: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingSearch: false } })
}
export function* LOAD_SELECT_IN_MAPPING_LEAGUE({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingSearch: true } })
  const response = yield call(svc.LoadLeagueMappingLeague, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        select_in_mapping_league: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingSearch: false } })
}
export function* LOAD_SELECT_IN_MAPPING_LEAGUE_RBALL({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingSearch: true } })
  const response = yield call(svc.LoadLeagueMappingLeagueRBall, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        select_in_mapping_league: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingSearch: false } })
}
export function* LOAD_SELECT_IN_MAPPING_BUILDER({ payload, source }) {
  const response = yield call(svc.LoadLeagueMappingBuilder, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        select_in_mapping_builder: data,
      },
    })
  }
}
export function* LOAD_SELECT_IN_ONLINE_LIST({ payload, source }) {
  const response = yield call(svc.LoadLeagueOnlineList, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        select_in_online_list: data,
      },
    })
  }
}
export function* LOAD_SELECT_IN_INSTANTBET({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingSearch: true } })
  const response = yield call(svc.LoadSelectInInstantBet, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        select_in_instantbet: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingSearch: false } })
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_SELECT, LOAD_SELECT),
    takeLeading(actions.UPDATE_SELECT, UPDATE_SELECT),
    takeLeading(actions.UPDATE_SELECT_REFRESH, UPDATE_SELECT_REFRESH),
    // takeLatest(actions.LOAD, LOAD),
    takeLatest(actions.LOAD_DATA, LOAD_DATA),
    takeLatest(actions.LOAD_DETAIL, LOAD_DETAIL),
    takeLatest(actions.LOAD_EXPORT_DATA, LOAD_EXPORT_DATA),
    takeLatest(actions.SEARCH, SEARCH),
    takeLatest(actions.LOAD_SELECT_IN_AUTOADDMATCH, LOAD_SELECT_IN_AUTOADDMATCH),
    takeLatest(actions.LOAD_SELECT_IN_MATCHLIST, LOAD_SELECT_IN_MATCHLIST),
    takeLatest(actions.LOAD_SELECT_IN_ADDMATCH, LOAD_SELECT_IN_ADDMATCH),
    takeLatest(actions.LOAD_SELECT_IN_MAPPING_LOTTERY, LOAD_SELECT_IN_MAPPING_LOTTERY),
    takeLatest(actions.LOAD_SELECT_IN_MATCH_PROFILE, LOAD_SELECT_IN_MATCH_PROFILE),
    takeLatest(actions.LOAD_SELECT_IN_MATCH_STATISTIC, LOAD_SELECT_IN_MATCH_STATISTIC),
    takeLatest(actions.LOAD_SELECT_IN_SCORING_MATCH, LOAD_SELECT_IN_SCORING_MATCH),
    takeLatest(actions.LOAD_SELECT_IN_PROCESS_MATCH, LOAD_SELECT_IN_PROCESS_MATCH),
    takeLatest(actions.LOAD_SELECT_IN_UNPROCESS_MATCH, LOAD_SELECT_IN_UNPROCESS_MATCH),
    takeLatest(actions.LOAD_SELECT_IN_OUTRIGHT, LOAD_SELECT_IN_OUTRIGHT),
    takeLatest(actions.LOAD_SELECT_IN_MAPPING_LEAGUE, LOAD_SELECT_IN_MAPPING_LEAGUE),
    takeLatest(actions.LOAD_SELECT_IN_MAPPING_LEAGUE_RBALL, LOAD_SELECT_IN_MAPPING_LEAGUE_RBALL),
    takeLatest(actions.LOAD_SELECT_IN_MAPPING_BUILDER, LOAD_SELECT_IN_MAPPING_BUILDER),
    takeLatest(actions.LOAD_SELECT_IN_ONLINE_LIST, LOAD_SELECT_IN_ONLINE_LIST),
    takeLatest(actions.LOAD_SELECT_IN_INSTANTBET, LOAD_SELECT_IN_INSTANTBET),

    takeLeading(actions.CREATE, CREATE),
    takeLeading(actions.UPDATE, UPDATE),
    takeLeading(actions.EDIT_PARENT_LEAGUE, EDIT_PARENT_LEAGUE),
    takeLeading(actions.EDIT_ODDS_STEP, EDIT_ODDS_STEP),
    takeLeading(actions.EDIT_SPREAD_PARLAY, EDIT_SPREAD_PARLAY),
    takeLeading(actions.EDIT_ODDS_DIFF, EDIT_ODDS_DIFF),
    takeLeading(actions.EDIT_1X2_DIFF, EDIT_1X2_DIFF),
    takeLeading(actions.EDIT_LAP_SHORT, EDIT_LAP_SHORT),
    takeLeading(actions.EDIT_AUTO_CLOSE, EDIT_AUTO_CLOSE),
    takeLeading(actions.EDIT_BET_GENIUS, EDIT_BET_GENIUS),
    takeLeading(actions.EDIT_TIMED_DIFF, EDIT_TIMED_DIFF),
    takeLeading(actions.EDIT_PROFILE_ID, EDIT_PROFILE_ID),
    takeLeading(actions.EDIT_PROFILE_1X2, EDIT_PROFILE_1X2),
    takeLeading(actions.EDIT_1X2_LAP, EDIT_1X2_LAP),
    takeLeading(actions.EDIT_SPECIAL_CODE, EDIT_SPECIAL_CODE),
    takeLeading(actions.EDIT_LEAGUE_GROUP, EDIT_LEAGUE_GROUP),
    takeLeading(actions.EDIT_REGION, EDIT_REGION),
    takeLeading(actions.EDIT_LINK_ODDS_DIFF, EDIT_LINK_ODDS_DIFF),
    takeLeading(actions.COPY_TO_LOTTERY, COPY_TO_LOTTERY),
  ])
}
