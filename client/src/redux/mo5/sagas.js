import { all, call, put, select, takeEvery, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/mo5'
import store from 'store'
import actions from './actions'

export function* GET_OGT_PAUSE_STATUS({ payload }) {
  try {
    yield put({ type: actions.ADD_CACHE, payload: { match_id: payload.match_id, loading: true } })

    const response = yield call(svc.GetOGTPauseStatus, payload)
    if (response) {
      const { data } = response
      yield put({
        type: actions.ADD_CACHE,
        payload: {
          match_id: payload.match_id,
          ogt_pause_status: data,
        },
      })
    }
  } finally {
    yield put({ type: actions.ADD_CACHE, payload: { match_id: payload.match_id, loading: false } })
  }
}
export function* GET_ALL_OGT_PAUSE_STATUS({ payload }) {
  // payload = match_ids
  const listOGTpauseStatus = yield select(state => state.mo5.list_ogt_pause_status)

  const existMatchIDs = listOGTpauseStatus.filter(e => payload.includes(e.match_id))
  yield all(
    existMatchIDs.map(e => call(GET_OGT_PAUSE_STATUS, { payload: { match_id: e.match_id } })),
  )

  const nonExistMatchIDs = listOGTpauseStatus.filter(e => !payload.includes(e.match_id))
  yield all(
    nonExistMatchIDs.map(e =>
      put({ type: actions.CLEAN_UP_OGT_PAUSE_STATUS, payload: e.match_id }),
    ),
  )
}

export function* SWAP_FAVOURITE({ payload, successCallback, source }) {
  const response = yield call(svc.SwapFavorite, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* UPDATE_ZERO_ODDS({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateZeroOdds, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* MOVE_HANDICAP({ payload, successCallback, source }) {
  const response = yield call(svc.MoveHandicap, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* CHANGE_HANDICAP({ payload, successCallback, source }) {
  const response = yield call(svc.ChangeHandicap, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* SWAP_HANDICAP({ payload, successCallback, source }) {
  const response = yield call(svc.SwapHandicap, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}

export function* CHANGE_ODDS({ payload, successCallback, source }) {
  const response = yield call(svc.ChangeOdds, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* CHANGE_ODDS_EURO({ payload, successCallback, source }) {
  const response = yield call(svc.ChangeOddsEuro, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* CHANGE_ODDS_CSLIVE({ payload, successCallback, source }) {
  const response = yield call(svc.ChangeOddsCSLive, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* CHANGE_ODDS_1X2({ payload, successCallback, source }) {
  const response = yield call(svc.ChangeOdds1x2, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* SWAP_ODDS({ payload, successCallback, source }) {
  const response = yield call(svc.SwapOdds, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* MOVE_ODDS({ payload, successCallback, source }) {
  const response = yield call(svc.MoveOdds, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* CHANGE_LOD({ payload, successCallback, source }) {
  const response = yield call(svc.ChangeLOD, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* CHANGE_SPREAD({ payload, successCallback, source }) {
  const response = yield call(svc.ChangeSpread, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* CHANGE_AUTO_CALC_ODDS_1X2({ payload, successCallback, source }) {
  const response = yield call(svc.ChangeAutoCalcOdds1X2, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* CHANGE_LDIFF({ payload, successCallback, source }) {
  const response = yield call(svc.ChangeLDiff, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}

export function* PAUSE_RESUME_CHOICE({ payload, successCallback, source }) {
  const response = yield call(svc.PauseResumeChoice, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* PAUSE_RESUME_SUB_MATCH_CS({ payload, successCallback, source }) {
  const response = yield call(svc.PauseResumeSubMatchCS, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* PAUSE_RESUME_SUB_MATCH({ payload, successCallback, source }) {
  const response = yield call(svc.PauseResumeSubMatch, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* PAUSE_RESUME_MATCH({ payload, successCallback, source }) {
  const response = yield call(svc.PauseResumeMatch, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* PAUSE_RESUME_ALL({ payload, successCallback, source }) {
  const response = yield call(svc.PauseResumeAll, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* OPEN_CLOSE_CHOICE({ payload, successCallback, source }) {
  const response = yield call(svc.OpenCloseChoice, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* OPEN_CLOSE_SUB_MATCH_CS({ payload, successCallback, source }) {
  const response = yield call(svc.OpenCloseSubMatchCS, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* OPEN_CLOSE_SUB_MATCH({ payload, successCallback, source }) {
  const response = yield call(svc.OpenCloseSubMatch, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* OPEN_CLOSE_MATCH({ payload, successCallback, source }) {
  const response = yield call(svc.OpenCloseMatch, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* FOLLOW_LEECH_SUB_MATCH({ payload, successCallback, source }) {
  const response = yield call(svc.FollowLeechSubMatch, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* UPDATE_LEECH_ASSIGN({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateLeechAssign, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}

export function* CHANGE_LOCK_1X2({ payload, successCallback, source }) {
  const response = yield call(svc.ChangeLock1X2, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}

function* SETUP() {
  function* initSetting() {
    const disable = store.get('app.settings.disable_notification_mo')
    yield SET_NOTIFICATION({ payload: disable })
  }

  yield* initSetting() // Use yield* to delegate the generator function
}
export function* SET_NOTIFICATION({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      disable_notification: payload,
    },
  })
  store.set('app.settings.disable_notification_mo', payload)
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_OGT_PAUSE_STATUS, GET_OGT_PAUSE_STATUS),
    takeEvery(actions.GET_ALL_OGT_PAUSE_STATUS, GET_ALL_OGT_PAUSE_STATUS),
    takeEvery(actions.SWAP_FAVOURITE, SWAP_FAVOURITE),
    takeLeading(actions.UPDATE_ZERO_ODDS, UPDATE_ZERO_ODDS),
    takeEvery(actions.MOVE_HANDICAP, MOVE_HANDICAP),
    takeEvery(actions.CHANGE_HANDICAP, CHANGE_HANDICAP),
    takeEvery(actions.SWAP_HANDICAP, SWAP_HANDICAP),

    takeEvery(actions.CHANGE_ODDS, CHANGE_ODDS),
    takeEvery(actions.CHANGE_ODDS_EURO, CHANGE_ODDS_EURO),
    takeEvery(actions.CHANGE_ODDS_CSLIVE, CHANGE_ODDS_CSLIVE),
    takeEvery(actions.CHANGE_ODDS_1X2, CHANGE_ODDS_1X2),
    takeEvery(actions.SWAP_ODDS, SWAP_ODDS),
    takeEvery(actions.MOVE_ODDS, MOVE_ODDS),
    takeEvery(actions.CHANGE_LOD, CHANGE_LOD),
    takeEvery(actions.CHANGE_SPREAD, CHANGE_SPREAD),
    takeEvery(actions.CHANGE_AUTO_CALC_ODDS_1X2, CHANGE_AUTO_CALC_ODDS_1X2),

    takeEvery(actions.PAUSE_RESUME_CHOICE, PAUSE_RESUME_CHOICE),
    takeEvery(actions.PAUSE_RESUME_SUB_MATCH_CS, PAUSE_RESUME_SUB_MATCH_CS),
    takeEvery(actions.PAUSE_RESUME_SUB_MATCH, PAUSE_RESUME_SUB_MATCH),
    takeEvery(actions.PAUSE_RESUME_MATCH, PAUSE_RESUME_MATCH),
    takeLeading(actions.PAUSE_RESUME_ALL, PAUSE_RESUME_ALL),
    takeEvery(actions.OPEN_CLOSE_CHOICE, OPEN_CLOSE_CHOICE),
    takeEvery(actions.OPEN_CLOSE_SUB_MATCH_CS, OPEN_CLOSE_SUB_MATCH_CS),
    takeEvery(actions.OPEN_CLOSE_SUB_MATCH, OPEN_CLOSE_SUB_MATCH),
    takeEvery(actions.OPEN_CLOSE_MATCH, OPEN_CLOSE_MATCH),
    takeEvery(actions.FOLLOW_LEECH_SUB_MATCH, FOLLOW_LEECH_SUB_MATCH),
    takeEvery(actions.UPDATE_LEECH_ASSIGN, UPDATE_LEECH_ASSIGN),
    takeLeading(actions.CHANGE_LOCK_1X2, CHANGE_LOCK_1X2),

    takeEvery(actions.SET_NOTIFICATION, SET_NOTIFICATION),
    SETUP(), // run once on app load to init listeners
  ])
}
