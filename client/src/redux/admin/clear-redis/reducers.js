import produce from 'immer'
import actions from './actions'

const initialState = {
  data: [],
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.UPDATE_STATE:
      return produce(state, draft => {
        const index = draft.data.findIndex(x => x.redis_key === action.payload.redis_key)
        if (index !== -1) {
          draft.data[index].status = action.payload.status
        }
      })
    case actions.CLEAN_UP:
      return initialState
    default:
      return state
  }
}
