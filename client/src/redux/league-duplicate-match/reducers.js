import actions from './actions'

const initialState = {
  data: [],
  loadingData: false,
  dataSearch: [],
  loadingSearch: false,
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.CLEAN_UP:
      return initialState
    case actions.CLEAN_UP_SEARCH:
      return { ...state, dataSearch: [] }
    default:
      return state
  }
}
