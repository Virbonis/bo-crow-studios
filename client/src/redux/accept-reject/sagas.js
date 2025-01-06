import { all, call, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/accept-reject'
import actions from './actions'

export function* UPDATE_TICKET_MO_BY_MATCH({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateTicketMOByMatch, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}

export function* UPDATE_TICKET_MO({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateTicketMO, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}
export function* UPDATE_TICKET_INSTANTBET({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateTicketInstantBet, payload, source)
  if (response) {
    if (typeof successCallback === 'function') successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLeading(actions.UPDATE_TICKET_MO_BY_MATCH, UPDATE_TICKET_MO_BY_MATCH),
    takeLeading(actions.UPDATE_TICKET_MO, UPDATE_TICKET_MO),
    takeLeading(actions.UPDATE_TICKET_INSTANTBET, UPDATE_TICKET_INSTANTBET),
  ])
}
