import { all, call, put, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/accept-rejected-ticket'
import actions from './actions'

export function* LOAD_ACCEPT_REJECTED_TICKET({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadAcceptRejectedTicket, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        data: data.result,
        total: data.total,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export function* ACCEPT_TICKET({ payload, successCallBack, source }) {
  const response = yield call(svc.UpdAcceptRejectedTicket, payload, source)
  if (response) {
    successCallBack()
  }
}

export default function* rootSaga() {
  yield all([
    takeLeading(actions.LOAD_ACCEPT_REJECTED_TICKET, LOAD_ACCEPT_REJECTED_TICKET),
    takeLeading(actions.ACCEPT_TICKET, ACCEPT_TICKET),
  ])
}
