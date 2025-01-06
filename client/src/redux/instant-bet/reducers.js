import produce from 'immer'
import actions from './actions'

const initialState = {
  gameTypeDetail: {},
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.SET_VIEW_PARAMETER:
      return produce(state, draftState => {
        Object.entries(action.payload).forEach(([key, value]) => {
          draftState.viewParameter[key] = value
        })
      })
    case actions.OPEN_INSTANT_BET_DETAIL:
      return { ...state, gameTypeDetail: action.payload }
    case actions.CLEAN_UP:
      return initialState
    default:
      return state
  }
}
