import produce from 'immer'
import actions from './actions'

const initialState = {
  loading: {},
  data: {
    dd: [],
  },
  select: [],
  viewParameter: {
    ftht: 'FTHT',
    show_hide: 1,
    match_time_slot: 'Live',
    interval: 3000,
  },
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
    case actions.CLEAN_UP:
      return initialState
    default:
      return state
  }
}
