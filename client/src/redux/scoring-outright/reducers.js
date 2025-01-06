import actions from './actions'

const initialState = {
  loadingTeam: false,
  loading: false,
  data: [],
  team: {},
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
