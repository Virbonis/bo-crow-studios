import { all, put, call, takeLatest } from 'redux-saga/effects'
import * as svc from 'services/customer-vip'
import { Download } from 'utils'
import actions from './actions'

export function* LOAD({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadData, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        data: data.result,
        total: data.total,
        dataSummary: data.result_summary,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}
export function* LOAD_COMPLIANCE({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loading: true } })
  const response = yield call(svc.LoadDataCompliance, payload, source)
  if (response) {
    const { data } = response
    yield put({
      type: actions.SET_STATE,
      payload: {
        data: data.result,
        total: data.total,
      },
    })
  }
  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export function* EXPORT({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingExport: true } })

  const response = yield call(svc.LoadData, payload, source)
  if (response) {
    const data = response.data?.result || []
    const title = [
      'Customer ID',
      'User Name',
      'Customer Level',
      'Branch Name',
      'VIP Code',
      'VIP Value 1',
      'VIP Value 2',
      'Stamp Date',
      'Stamp User',
    ]
    const newData = data.map(e => ({
      customer_id: e.customer_id,
      user_name: e.user_name,
      customer_level: e.customer_level,
      branch_name: e.branch_name,
      vip_code: e.vip_code,
      vip_value: e.is_show_value1 === 'Y' ? e.vip_value.toFixed(2) : '',
      vip_value2: e.is_show_value2 === 'Y' ? e.vip_value2.toFixed(2) : '',
      stamp_date: e.stamp_date,
      stamp_user: e.stamp_user,
    }))
    Download(title, newData, `CustomerVIP`)
  }
  yield put({ type: actions.SET_STATE, payload: { loadingExport: false } })
}
export function* EXPORT_COMPLIANCE({ payload, source }) {
  yield put({ type: actions.SET_STATE, payload: { loadingExport: true } })

  const response = yield call(svc.LoadDataCompliance, payload, source)
  if (response) {
    const data = response.data?.result || []
    const title = [
      'Customer ID',
      'User Name',
      'Customer Level',
      'Branch Name',
      'VIP Code',
      'VIP Value 1',
      'VIP Value 2',
      'Status',
      'Stamp Date',
      'Stamp User',
    ]
    const newData = data.map(e => ({
      customer_id: e.customer_id,
      user_name: e.user_name,
      customer_level: e.customer_level,
      branch_name: e.branch_name,
      vip_code: e.vip_code,
      vip_value: e.is_show_value1 === 'Y' && e.vip_value,
      vip_value2: e.is_show_value2 === 'Y' && e.vip_value2,
      status: getStatusType(e.status),
      stamp_date: e.stamp_date,
      stamp_user: e.stamp_user,
    }))
    Download(title, newData, `CustomerVIPComplience`)
  }
  yield put({ type: actions.SET_STATE, payload: { loadingExport: false } })
}

const getStatusType = status => {
  if (status === -1) return 'Remove'
  if (status === 1) return 'Add'
  if (status === 2) return 'Update'
  return '-'
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD, LOAD),
    takeLatest(actions.LOAD_COMPLIANCE, LOAD_COMPLIANCE),
    takeLatest(actions.EXPORT, EXPORT),
    takeLatest(actions.EXPORT_COMPLIANCE, EXPORT_COMPLIANCE),
  ])
}
