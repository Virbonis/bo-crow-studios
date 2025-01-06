import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects'
import { Download } from 'utils'
import getCustomerTypeDescription from 'pages/report/ledger/pages/desc'
import * as svc from 'services/customer-list'
import actions from './actions'

export function* LOAD_CUSTOMER_LIST({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadCustomerList, payload, source)
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

export function* EXPORT_CUSTOMER_LIST({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingExport: true } })
  const response = yield call(svc.ExportCustomerList, payload, source)
  if (response) {
    const { data } = response
    const title = [
      'Customer ID',
      'Customer Type',
      'Customer Level',
      'Branch',
      'User Name',
      'Currency',
      'Cash Balance',
      'Join Date',
      'Status',
      'Profile',
    ]

    const dataNew = data.map(e => ({
      customer_id: e.customer_id,
      customer_type: getCustomerTypeDescription(e.customer_type),
      customer_level: e.customer_level,
      branch_name: e.branch_name,
      username: e.username,
      currency: e.currency,
      cash_balance: e.cash_balance,
      join_date: e.join_date,
      customer_active_status: e.customer_active_status === 0 ? 'Disabled' : 'Active',
      limit_profile_id: e.limit_profile_id,
    }))

    Download(title, dataNew, 'CustomerList.xlsx')
  }
  yield put({ type: actions.SET_STATE, payload: { loadingExport: false } })
}

export function* UPDATE_RESET_PASSWORD_CUSTOMER({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateResetPasswordCustomer, payload, source)
  if (response) {
    successCallback()
  }
}

export function* LOAD_EDIT_CUSTOMER({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingDrawer: true } })
  const response = yield call(svc.LoadEditCustomer, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        editCustomerData: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingDrawer: false } })
}
export function* LOAD_UPLINE_CUSTOMER({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadUplineCustomer, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        uplineData: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}
export function* UPDATE_EDIT_CUSTOMER({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateEditCustomer, payload, source)
  if (response) {
    successCallback()
  }
}

export function* LOAD_LIMIT_PROFILE({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingDrawer: true } })
  const response = yield call(svc.LoadLimitProfile, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        limitProfile: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingDrawer: false } })
}
export function* LOAD_CUSTOMER_BET_LIMIT({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingDrawer: true } })
  const response = yield call(svc.LoadCustomerBetLimit, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        betLimitData: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingDrawer: false } })
}
export function* LOAD_CUSTOMER_BET_LIMIT_BY_SPORT({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingDrawer: true } })
  const response = yield call(svc.LoadCustomerBetLimitBySport, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        betLimitDataBySport: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingDrawer: false } })
}
export function* UPDATE_CUSTOMER_BET_LIMIT({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateCustomerBetLimit, payload, source)
  if (response) {
    successCallback()
  }
}
export function* UPDATE_CUSTOMER_BET_LIMIT_BY_SPORT({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateCustomerBetLimitBySport, payload, source)
  if (response) {
    successCallback()
  }
}

export function* LOAD_BET_LIMIT_LOG({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingDrawer: true } })
  const response = yield call(svc.LoadBetLimitLog, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        betLimitLogData: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingDrawer: false } })
}
export function* LOAD_VIP_LOG({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingDrawer: true } })
  const response = yield call(svc.LoadVIPLog, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        vipLogData: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingDrawer: false } })
}

export function* LOAD_CUSTOMER_DELAY_BET({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingDelayBet: true } })
  const response = yield call(svc.LoadCustomerDelayBet, payload, source)
  if (response) {
    const { status, data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        status,
        dataDelayBet: data,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loadingDelayBet: false } })
}
export function* UPDATE_CUSTOMER_DELAY_BET({ payload, successCallback, source }) {
  const response = yield call(svc.UpdateCustomerDelayBet, payload, source)
  if (response) {
    successCallback()
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD_UPLINE_CUSTOMER, LOAD_UPLINE_CUSTOMER),
    takeLatest(actions.LOAD_CUSTOMER_LIST, LOAD_CUSTOMER_LIST),
    takeLatest(actions.EXPORT_CUSTOMER_LIST, EXPORT_CUSTOMER_LIST),
    takeLatest(actions.LOAD_EDIT_CUSTOMER, LOAD_EDIT_CUSTOMER),
    takeLatest(actions.LOAD_LIMIT_PROFILE, LOAD_LIMIT_PROFILE),
    takeLatest(actions.LOAD_CUSTOMER_BET_LIMIT, LOAD_CUSTOMER_BET_LIMIT),
    takeLatest(actions.LOAD_CUSTOMER_BET_LIMIT_BY_SPORT, LOAD_CUSTOMER_BET_LIMIT_BY_SPORT),
    takeLatest(actions.LOAD_BET_LIMIT_LOG, LOAD_BET_LIMIT_LOG),
    takeLatest(actions.LOAD_VIP_LOG, LOAD_VIP_LOG),
    takeLeading(actions.UPDATE_RESET_PASSWORD_CUSTOMER, UPDATE_RESET_PASSWORD_CUSTOMER),
    takeLeading(actions.UPDATE_EDIT_CUSTOMER, UPDATE_EDIT_CUSTOMER),
    takeLeading(actions.UPDATE_CUSTOMER_BET_LIMIT, UPDATE_CUSTOMER_BET_LIMIT),
    takeLeading(actions.UPDATE_CUSTOMER_BET_LIMIT_BY_SPORT, UPDATE_CUSTOMER_BET_LIMIT_BY_SPORT),
    takeLeading(actions.LOAD_CUSTOMER_DELAY_BET, LOAD_CUSTOMER_DELAY_BET),
    takeLeading(actions.UPDATE_CUSTOMER_DELAY_BET, UPDATE_CUSTOMER_DELAY_BET),
  ])
}
