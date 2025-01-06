import produce from 'immer'
import actions from './actions'

const initialState = {
  select: [],
  loading: false,
  data: [],
  loadingDelayBet: false,
  dataDelayBet: [],
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return produce(state, draftState => {
        Object.entries(action.payload).forEach(([key, value]) => {
          draftState[key] = value
        })
      })
    case actions.CLEAN_UP:
      return initialState
    default:
      return state
  }
}
