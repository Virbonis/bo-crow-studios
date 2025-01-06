import { all, put, call, takeLatest, takeLeading, select } from 'redux-saga/effects'
import * as svc from 'services/auto-add-sub-match-more'
import { LOAD_MATCH } from 'redux/mo-match-edit/sagas'
import actions from './actions'

export function* LOAD_DATA({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })

  const moEditData = yield select(state => state.moEdit.data)
  if (moEditData.match?.match_id !== payload.match_id) yield LOAD_MATCH({ payload, source })
  yield GET_STATUS({ payload, source })
  yield LOAD_SUB_MATCH_MORE({ payload, source })

  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export function* GET_STATUS({ payload, source }) {
  const response = yield call(svc.GetStatusSubMatchMore, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status: data,
      },
    })
  }
}
export function* LOAD_SUB_MATCH_MORE({ payload, source }) {
  const response = yield call(svc.ListSubMatchMore, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        data,
      },
    })
  }
}
export function* REQUEST_SUB_MATCH_MORE({ payload, successCallback, source }) {
  const response = yield call(svc.RequestSubMatchMore, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
    yield GET_STATUS({ payload, source })
  }
}
export function* RESET_SUB_MATCH_MORE({ payload, successCallback, source }) {
  const response = yield call(svc.ResetSubMatchMore, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
    yield GET_STATUS({ payload, source })
  }
}
export function* UPDATE_SUB_MATCH_MORE({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateSubMatchMore, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_DATA, LOAD_DATA),
    takeLatest(actions.REQUEST_SUB_MATCH_MORE, REQUEST_SUB_MATCH_MORE),
    takeLatest(actions.RESET_SUB_MATCH_MORE, RESET_SUB_MATCH_MORE),
    takeLeading(actions.UPDATE_SUB_MATCH_MORE, UPDATE_SUB_MATCH_MORE),
    takeLeading(actions.GET_STATUS, GET_STATUS),
  ])
}
