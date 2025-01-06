import actions from './actions'

const initialState = {
  loadingData: false,
  data: [],
  data_special: [],
  loadingSpecial: false,
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
