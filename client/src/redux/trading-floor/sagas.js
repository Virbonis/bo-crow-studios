import { all, call, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/trading-floor'
import actions from './actions'

export function* UPDATE_MATCH_MORE_GT({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateMatchMoreGT, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* UPDATE_OPEN_CLOSE_MATCH({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateOpenCloseMatch, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* UPDATE_PAUSE_RESUME_MATCH({ payload, successCallback, source }) {
  const response = yield call(svc.UpdatePauseResumeMatch, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* UPDATE_OPEN_CLOSE_SUB_MATCH({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateOpenCloseSubMatch, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* UPDATE_PAUSE_RESUME_SUB_MATCH({ payload, successCallback, source }) {
  const response = yield call(svc.UpdatePauseResumeSubMatch, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* UPDATE_LIVE_FINALIZE({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateLiveFinalize, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* UPDATE_ODDS_HDC({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateOddsHDC, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* UPDATE_TRADING_MOVE_ODDS({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateTradingMoveOdds, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}

export function* UPDATE_OPEN_CLOSE_SUB_MATCH_OUTRIGHT({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateOpenCloseSubMatchOutright, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* UPDATE_PAUSE_RESUME_SUB_MATCH_OUTRIGHT({ payload, successCallback, source }) {
  const response = yield call(svc.UpdatePauseResumeSubMatchOutright, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* UPDATE_OPEN_CLOSE_OUTRIGHT({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateOpenCloseOutright, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* UPDATE_PAUSE_RESUME_OUTRIGHT({ payload, successCallback, source }) {
  const response = yield call(svc.UpdatePauseResumeOutright, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* UPDATE_TRADING_OUTRIGHT_SETTING({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateTradingOutrightSetting, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}
export function* UPDATE_TRADING_CONFIRM_OUTRIGHT({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateTradingConfirmOutright, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}

export default function* rootSaga() {
  yield all([
    takeLeading(actions.UPDATE_MATCH_MORE_GT, UPDATE_MATCH_MORE_GT),

    takeLeading(actions.UPDATE_OPEN_CLOSE_MATCH, UPDATE_OPEN_CLOSE_MATCH),
    takeLeading(actions.UPDATE_PAUSE_RESUME_MATCH, UPDATE_PAUSE_RESUME_MATCH),
    takeLeading(actions.UPDATE_OPEN_CLOSE_SUB_MATCH, UPDATE_OPEN_CLOSE_SUB_MATCH),
    takeLeading(actions.UPDATE_PAUSE_RESUME_SUB_MATCH, UPDATE_PAUSE_RESUME_SUB_MATCH),

    takeLeading(actions.UPDATE_LIVE_FINALIZE, UPDATE_LIVE_FINALIZE),
    takeLeading(actions.UPDATE_ODDS_HDC, UPDATE_ODDS_HDC),
    takeLeading(actions.UPDATE_TRADING_MOVE_ODDS, UPDATE_TRADING_MOVE_ODDS),

    takeLeading(actions.UPDATE_OPEN_CLOSE_OUTRIGHT, UPDATE_OPEN_CLOSE_OUTRIGHT),
    takeLeading(actions.UPDATE_PAUSE_RESUME_OUTRIGHT, UPDATE_PAUSE_RESUME_OUTRIGHT),
    takeLeading(actions.UPDATE_OPEN_CLOSE_SUB_MATCH_OUTRIGHT, UPDATE_OPEN_CLOSE_SUB_MATCH_OUTRIGHT),
    takeLeading(
      actions.UPDATE_PAUSE_RESUME_SUB_MATCH_OUTRIGHT,
      UPDATE_PAUSE_RESUME_SUB_MATCH_OUTRIGHT,
    ),
    takeLeading(actions.UPDATE_TRADING_OUTRIGHT_SETTING, UPDATE_TRADING_OUTRIGHT_SETTING),
    takeLeading(actions.UPDATE_TRADING_CONFIRM_OUTRIGHT, UPDATE_TRADING_CONFIRM_OUTRIGHT),
  ])
}
