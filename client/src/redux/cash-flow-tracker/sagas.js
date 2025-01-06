import { all, put, call, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/cash-flow-tracker'
import actions from './actions'

export function* LOAD({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { [`loading${payload.hist_or_post}`]: true } })
  const response = yield call(svc.Load, payload, source)
  if (response) {
    const { data } = response

    const temp = data.reduce((acc, curr, idx, arr) => {
      acc.push(curr)
      if (arr[idx]?.track_date?.substring(0, 11) !== arr[idx + 1]?.track_date?.substring(0, 11)) {
        acc.push({
          summary: true,
          track_id: `summary-${arr[idx].track_date}`,
          track_date: curr.track_date.substring(0, 11),
          amount_change: acc
            .slice(acc.findLastIndex(x => x.summary) + 1, acc.length)
            .reduce((x, y) => {
              return x + y.amount_change
            }, 0),
          previous_balance: curr.previous_balance,
          last_balance: acc[acc.findLastIndex(x => x.summary) + 1].current_balance,
        })
      }

      return acc
    }, [])

    yield put({
      type: actions.SET_STATE,
      payload: {
        [`data${payload.hist_or_post}`]: temp,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { [`loading${payload.hist_or_post}`]: false } })
}

export default function* rootSaga() {
  yield all([takeLatest(actions.LOAD, LOAD)])
}
