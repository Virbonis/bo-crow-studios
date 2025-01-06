import actions from './actions'

const initialState = {
  menuData: [
    {
      menu_id: 1,
      title: 'Test',
      icon: 'fe fe-globe',
      url: '',
    },
    {
      menu_id: 2,
      parent: 'Test',
      title: 'Test 1',
      url: '/test',
    },
  ],
}

export default function menuReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
