import actions from './actions'

const initialState = {
  data: [
    {
      application_id: 1,
      name: 'Back Office Admin',
      roles: '',
      menus: '',
      is_active: true,
    },
    {
      application_id: 2,
      name: 'Customer',
      roles: '',
      menus: '',
      is_active: true,
    },
    {
      application_id: 3,
      name: 'Sport Books',
      roles: '',
      menus: '',
      is_active: true,
    },
  ],
  menu: [],
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.CLEAN_UP:
      return initialState
    default:
      return state
  }
}
