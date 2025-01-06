import { all, call, takeEvery, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/mo-scoring-detail'
import actions from './actions'

export function OPEN_EDIT({ payload }) {
  const { match_id, league_name, home_name, away_name, sport_id } = payload
  const title = `${match_id} - ${home_name} - ${away_name}`
  const qs = {
    match_id,
    league_name,
    home_name,
    away_name,
    sport_id,
    title,
  }
  window.open(
    `/#/trading/mo-scoring-detail-fly?${new URLSearchParams(qs).toString()}`,
    `MOScoringDetail-${match_id}`,
    'height=325,width=900,scrollbars=no',
  )
}

export function* UPDATE_SCORE_DETAIL({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateScoreDetail, payload, source)
  if (response && typeof successCallback === 'function') successCallback()
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.OPEN_EDIT, OPEN_EDIT),
    takeLeading(actions.UPDATE_SCORE_DETAIL, UPDATE_SCORE_DETAIL),
  ])
}
