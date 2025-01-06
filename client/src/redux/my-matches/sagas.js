import { all, put, call, takeEvery } from 'redux-saga/effects'
import * as svc from 'services/match-assignment'
import actions from './actions'

export function* LOAD_COUNTER({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingCounter: true } })

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
        ],
      },
    })
  }

  yield put({ type: actions.SET_STATE, payload: { loadingCounter: false } })
}
export function* LOAD_MATCH({ payload, source }) {
  const { match_time_slot } = payload
  const loadingKey = `loadingData_${match_time_slot}`
  const dataKey = `data_${match_time_slot}`

  yield put({ type: actions.SET_STATE, payload: { [loadingKey]: true } })
  const response = yield call(svc.LoadMyMatches, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        [dataKey]: data.map(x => {
          const traders = x.trader_name.split(';')?.map(e => e.split('~'))

          return {
            ...x,
            trader_dbht: traders.find(([key]) => key === 'DBHT')?.[1],
            trader_dbft: traders.find(([key]) => key === 'DBFT')?.[1],
            trader_rbht: traders.find(([key]) => key === 'RBHT')?.[1],
            trader_rbft: traders.find(([key]) => key === 'RBFT')?.[1],
          }
        }),
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { [loadingKey]: false } })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOAD_COUNTER, LOAD_COUNTER),
    takeEvery(actions.LOAD_MATCH, LOAD_MATCH),
  ])
}
