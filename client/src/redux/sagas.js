import { all } from 'redux-saga/effects'
import authuser from './auth/user/sagas'
import authsettings from './auth/setting/sagas'

export default function* rootSaga() {
  yield all([authuser(), authsettings()])
}
