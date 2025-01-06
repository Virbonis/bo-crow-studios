import produce from 'immer'
import actions from './actions'

const initialState = {
  list_ogt_pause_status: [],
  enable_notification: true,
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.ADD_CACHE: {
      return {
        ...state,
        list_ogt_pause_status: produce(state.list_ogt_pause_status, draft => {
          const index = draft.findIndex(x => x.match_id === action.payload.match_id)
          if (index === -1) draft.push(action.payload)
          else draft[index] = { ...draft[index], ...action.payload }
        }),
      }
    }
    case actions.CLEAN_UP:
      return initialState
    case actions.CLEAN_UP_OGT_PAUSE_STATUS: {
      return {
        ...state,
        list_ogt_pause_status: state.list_ogt_pause_status.filter(
          x => x.match_id !== action.payload,
        ),
      }
    }
    default:
      return state
  }
}
