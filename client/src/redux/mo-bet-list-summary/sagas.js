import { all, call, put, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/mo-bet-list-summary'
import actions from './actions'

export function* RESET_FTHT_SCORE({ payload, successCallback, source }) {
  const response = yield call(svc.resetFTHTScore, payload, source)
  if (response) {
    successCallback()
  }
}

export function* GET_BET_LIST_SUMMARY({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })

  const response = yield call(svc.getBetListSummary, payload, source)
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

export default function* rootSaga() {
  yield all([
    takeLeading(actions.RESET_FTHT_SCORE, RESET_FTHT_SCORE),
    takeLeading(actions.GET_BET_LIST_SUMMARY, GET_BET_LIST_SUMMARY),
  ])
}
