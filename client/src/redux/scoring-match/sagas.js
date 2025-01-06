import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/scoring-match'
import actions from './actions'

export function* LOAD({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.Load, payload, source)
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
  yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
}

export function* UPDATE_HOME_AWAY_POSISI({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateHomeAwayPosisi, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}

export function* UPDATE_SCORING_MATCH({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateScoringMatch, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}

export function* UPDATE_SCORING_RESET_MATCH({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateScoringResetMatch, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}

export function* LOAD_SPECIAL({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingSpecial: true } })
  const response = yield call(svc.LoadSpecial, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        specialData: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingSpecial: false } })
}

export function* UPDATE_SCORING_MATCH_SPECIAL({ payload, successCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingSpecial: true } })
  const response = yield call(svc.UpdateScoringMatchSpecial, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
  yield put({ type: actions.SET_STATE, payload: { loadingSpecial: false } })
}

export function* LOAD_SCORING_DETAIL_MATCH({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingDetailData: true } })
  const response = yield call(svc.LoadScoringDetailMatch, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        detailData: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingDetailData: false } })
}

export function* UPDATE_SCORING_DETAIL({ payload, successCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingDetailData: true } })
  const response = yield call(svc.UpdateScoringDetail, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
  yield put({ type: actions.SET_STATE, payload: { loadingDetailData: false } })
}

export function* DELETE_SCORING_DETAIL({ payload, successCallback, source }) {
  const response = yield call(svc.DeleteScoringDetail, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
}

export function* LOAD_SPECIAL_BASKET({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingSpecial: true } })
  const response = yield call(svc.LoadSpecialBasket, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        specialData: data.detail,
        specialDataScore: data.score,
        specialDataLiveScore: data.livescore,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingSpecial: false } })
}

export function* UPDATE_SCORING_MATCH_SPECIAL_BASKET({ payload, successCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingSpecial: true } })
  const response = yield call(svc.UpdateScoringMatchSpecialBasket, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
  yield put({ type: actions.SET_STATE, payload: { loadingSpecial: false } })
}
export function* UPDATE_SCORE_MAIN_ROUND({ payload, successCallback, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingSpecial: true } })
  const response = yield call(svc.UpdateScoringMatchSpecialMainRound, payload, source)
  if (response && typeof successCallback === 'function') {
    successCallback()
  }
  yield put({ type: actions.SET_STATE, payload: { loadingSpecial: false } })
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD, LOAD),
    takeLatest(actions.LOAD_SPECIAL, LOAD_SPECIAL),
    takeLatest(actions.LOAD_SPECIAL_BASKET, LOAD_SPECIAL_BASKET),
    takeLatest(actions.LOAD_SCORING_DETAIL_MATCH, LOAD_SCORING_DETAIL_MATCH),
    takeLeading(actions.UPDATE_HOME_AWAY_POSISI, UPDATE_HOME_AWAY_POSISI),
    takeLeading(actions.UPDATE_SCORING_MATCH, UPDATE_SCORING_MATCH),
    takeLeading(actions.UPDATE_SCORING_RESET_MATCH, UPDATE_SCORING_RESET_MATCH),
    takeLeading(actions.UPDATE_SCORING_MATCH_SPECIAL, UPDATE_SCORING_MATCH_SPECIAL),
    takeLeading(actions.UPDATE_SCORING_DETAIL, UPDATE_SCORING_DETAIL),
    takeLeading(actions.DELETE_SCORING_DETAIL, DELETE_SCORING_DETAIL),
    takeLeading(actions.UPDATE_SCORING_MATCH_SPECIAL_BASKET, UPDATE_SCORING_MATCH_SPECIAL_BASKET),
    takeLeading(actions.UPDATE_SCORE_MAIN_ROUND, UPDATE_SCORE_MAIN_ROUND),
  ])
}
