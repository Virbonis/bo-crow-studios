import { all, put, takeLatest } from 'redux-saga/effects'
import { RetryPreload } from 'redux/preload-state'
import LoadMenuData from 'services/menu'
import actions from './actions'

export function* LOAD({ source }) {
  const response = yield RetryPreload(LoadMenuData, source)
  if (response) {
    const [menuData = [], menuTree = []] = response
    yield put({
      type: 'auth/menu/SET_STATE',
      payload: {
        menuData,
        menuTree,
      },
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOAD, LOAD),
    // LOAD(), // run once on app load to fetch menu data
  ])
}
