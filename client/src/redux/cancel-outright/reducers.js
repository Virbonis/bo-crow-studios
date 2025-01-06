// import produce from 'immer'
import actions from './actions'

const initialState = {
  loadingData: false,
  data: [],
  // team: {},
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    // case actions.SET_STATE_TEAM:
    //   return produce(state, draft => {
    //     draft.team[action.payload.key] = action.payload.data
    //   })
    case actions.CLEAN_UP:
      return initialState
    default:
      return state
  }
}
