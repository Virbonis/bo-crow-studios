import { all, put, call, takeLatest, fork } from 'redux-saga/effects'
import * as svc from 'services/bet-listing'
import actions from './actions'

export function* LOAD_LEAGUE({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingLeague: true } })
  const response = yield call(svc.LoadLeague, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        league_select: data,
        match_select: [],
      },
    })
    if (data.length > 0) {
      yield fork(LOAD_MATCH, { payload: { ...payload, league_id: data[0]?.league_id }, source })
    }
  }
  yield put({ type: actions.SET_STATE, payload: { loadingLeague: false } })
}

export function* LOAD_MATCH({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingMatch: true } })
  const response = yield call(svc.LoadMatch, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        match_select: data,
      },
    })
    if (data.length > 0) {
      yield fork(LOAD_TABLE, { payload: { ...payload, match_id: data[0]?.match_id }, source })
    }
  }
  yield put({ type: actions.SET_STATE, payload: { loadingMatch: false } })
}

export function* LOAD_TABLE({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.LoadTable, payload, source)
  if (response) {
    const { status, data } = response
    let totalCAmtHome = 0
    let totalCAmtAway = 0
    data.home.forEach(({ bet_amount_comp }) => {
      totalCAmtHome += bet_amount_comp
    })
    data.away.forEach(({ bet_amount_comp }) => {
      totalCAmtAway += bet_amount_comp
    })

    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        data: {
          ...data,
          total:
            data.home.length > 0 || data.away.length > 0
              ? [
                  {
                    name: data.home[0]?.home_name
                      ? data.home[0]?.home_name
                      : data.away[0]?.home_name,
                    total: totalCAmtHome,
                    difference: totalCAmtHome - totalCAmtAway,
                  },
                  {
                    name: data.away[0]?.away_name
                      ? data.away[0]?.away_name
                      : data.home[0]?.away_name,
                    total: totalCAmtAway,
                    difference: totalCAmtHome - totalCAmtAway,
                  },
                ]
              : [],
        },
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingData: false } })
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_LEAGUE, LOAD_LEAGUE),
    takeLatest(actions.LOAD_MATCH, LOAD_MATCH),
    takeLatest(actions.LOAD_TABLE, LOAD_TABLE),
  ])
}
