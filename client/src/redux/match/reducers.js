import produce from 'immer'
import actions from './actions'

const initialState = {
  loading: false,
  data: [],
  select: [],
  select_in_mo: [],
  select_in_betlist: [],
  select_in_instantbet: [],
  data_match_sequence: [],
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
