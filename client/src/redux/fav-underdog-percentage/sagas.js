import { all, put, call, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/fav-underdog-percentage'
import { Download } from 'utils'
import actions from './actions'

export function* LOAD_TABLE({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingData: true } })
  const response = yield call(svc.LoadTable, payload, source)
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

export function* LOAD_EXPORT({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingExport: true } })

  const response = yield call(svc.LoadTable, payload, source)
  if (response) {
    const data = response.data || []
    const title = [
      'No',
      'Branch',
      'Currency',
      'Dead Ball Fav (%)',
      'Dead Ball Underdog (%)',
      'Dead Ball Over (%)',
      'Dead Ball Under (%)',
      'Running Ball Fav (%)',
      'Running Ball Underdog (%)',
      'Running Ball Over (%)',
      'Running Ball Under (%)',
    ]
    const newData = data.map((e, index) => ({
      no: index + 1,
      branch: e.branch_name,
      currency: e.currency,
      dead_ball_fav: e.dead_ball_fav,
      dead_ball_underdog: e.dead_ball_underdog,
      dead_ball_over: e.dead_ball_over,
      dead_ball_under: e.dead_ball_under,
      running_ball_fav: e.running_ball_fav,
      running_ball_underdog: e.running_ball_underdog,
      running_ball_over: e.running_ball_over,
      running_ball_under: e.running_ball_under,
    }))
    Download(title, newData, `Fav Underdog Percentage`)
  }
  yield put({ type: actions.SET_STATE, payload: { loadingExport: false } })
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_TABLE, LOAD_TABLE),
    takeLatest(actions.LOAD_EXPORT, LOAD_EXPORT),
  ])
}
