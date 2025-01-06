import actions from './actions'

const initialState = {
  loading: false,
  loading_bet_detail: false,
  data: [],
  dataMulti: [],
  dataBetDetail: [],
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.EDIT:
      return { ...state, editValue: action.payload }
    case actions.CLEAN_UP:
      return initialState
    default:
      return state
  }
}
