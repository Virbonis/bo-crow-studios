import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import authuser from './auth/user/reducers'
import authmenu from './auth/menu/reducers'
import authsettings from './auth/setting/reducers'

export default history =>
  combineReducers({
    router: connectRouter(history),
    auth: combineReducers({
      user: authuser,
      menu: authmenu,
      settings: authsettings,
    }),
  })
