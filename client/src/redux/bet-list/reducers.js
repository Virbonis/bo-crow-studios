import produce from 'immer'
import actions from './actions'

const initialState = {
  editValue: {
    // match_id: 5675828,
    // sub_match_id: 1,
  },
  viewParameter: {
    st_live: '', // Running
    ftht: '', // FirstHalf
    list_gt: [], // GameType
    interval: 0, // interval
  },
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.EDIT:
      return { ...state, editValue: action.payload }
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
