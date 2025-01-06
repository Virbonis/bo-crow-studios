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
    {
      menu_id: 3,
      title: 'Test 2',
      icon: 'fe fe-globe',
      url: '',
    },
    {
      menu_id: 4,
      parent: 'Test 2',
      title: 'Test 2',
      url: '/test2',
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
