import actions from './actions'

const initialState = {
  id: '',
  name: 'Dicky',
  roles: ['Admin'],
  email: 'lol@yahoo.com',
  avatar: '',
  authorized: false, // false is default value
  loading: false,
  last_login: '2024-12-12',
  user_auth_ids: ['1', '2'],
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
