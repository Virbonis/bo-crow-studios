import { all, put, call, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/trader-performance/index'
import actions from './actions'

export function* LOAD_TRADER({ payload, source }) {
  yield put({
    type: actions.SET_STATE,
    payload: { [`loadingOption${payload.hist_or_post}`]: true },
  })
  const loadTrader = yield call(svc.LoadTrader, payload, source)
  if (loadTrader) {
    const { data } = loadTrader
    yield put({
      type: actions.SET_STATE,
      payload: {
        [`listTrader${payload.hist_or_post}`]: data,
      },
    })
  }
  yield put({
    type: actions.SET_STATE,
    payload: { [`loadingOption${payload.hist_or_post}`]: false },
  })
}

export function* LOAD_LEAGUE({ payload, source }) {
  yield put({
    type: actions.SET_STATE,
    payload: { [`loadingOption${payload.hist_or_post}`]: true },
  })
  const loadLeague = yield call(svc.LoadLeague, payload, source)
  if (loadLeague) {
    const { data } = loadLeague
    yield put({
      type: actions.SET_STATE,
      payload: {
        [`listLeague${payload.hist_or_post}`]: data,
      },
    })
  }
  yield put({
    type: actions.SET_STATE,
    payload: { [`loadingOption${payload.hist_or_post}`]: false },
  })
}

export function* LOAD({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { [`loading${payload.hist_or_post}`]: true } })

  const response = yield call(svc.Load, payload, source)
  if (response) {
    const { data } = response

    // sub total each data by match_date
    // which contains bet_amount, winloss, winloss_company, stock_company, margin1, margin2
    const newData = data.reduce((acc, curr) => {
      if (!acc.find(e => e.match_id === curr.match_id)) {
        const subMatch = data
          .filter(e => e.match_id === curr.match_id)
          .map(x => ({
            ...x,
            key: `${x.match_date}-${x.match_id}-${x.game_type}-${x.market_time}`,
          }))
        const subTotal = subMatch.reduce(
          (sTotal, match) => {
            return {
              bet_amount: sTotal.bet_amount + match.bet_amount,
              winloss: sTotal.winloss + match.winloss,
              winloss_company: sTotal.winloss_company + match.winloss_company,
              stock_company: sTotal.stock_company + match.stock_company,
            }
          },
          {
            bet_amount: 0,
            winloss: 0,
            winloss_company: 0,
            stock_company: 0,
          },
        )
        acc = acc.concat([
          ...subMatch,
          {
            key: `${curr.match_id}-${curr.match_date}-subtotal`,
            is_sub_total: true,
            ...subTotal,
            margin1: (subTotal.winloss / subTotal.bet_amount) * -100,
            margin2: (subTotal.winloss_company / subTotal.stock_company) * 100,
          },
        ])
      }
      return acc
    }, [])

    const grandTotal = newData.reduce(
      (gTotal, curr) => {
        if (curr.is_sub_total) {
          return {
            bet_amount: gTotal.bet_amount + curr.bet_amount,
            winloss: gTotal.winloss + curr.winloss,
            winloss_company: gTotal.winloss_company + curr.winloss_company,
            stock_company: gTotal.stock_company + curr.stock_company,
          }
        }
        return gTotal
      },
      {
        bet_amount: 0,
        winloss: 0,
        winloss_company: 0,
        stock_company: 0,
      },
    )

    yield put({
      type: actions.SET_STATE,
      payload: {
        [`data${payload.hist_or_post}`]: newData,
        [`grandTotal${payload.hist_or_post}`]: {
          ...grandTotal,
          margin1: (grandTotal.winloss / grandTotal.bet_amount) * -100,
          margin2: (grandTotal.winloss_company / grandTotal.stock_company) * 100,
        },
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { [`loading${payload.hist_or_post}`]: false } })
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_TRADER, LOAD_TRADER),
    takeLatest(actions.LOAD_LEAGUE, LOAD_LEAGUE),
    takeLatest(actions.LOAD, LOAD),
  ])
}
