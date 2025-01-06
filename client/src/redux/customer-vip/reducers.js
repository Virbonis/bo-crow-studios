import actions from './actions'

const initialState = {
  loading: false,
  data: [],
  total: 0,
  dataSummary: [],
  loadingExport: false,
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
