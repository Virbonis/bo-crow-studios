import produce from 'immer'
import { isEmpty } from 'lodash'
import actions from './actions'

const initialState = {
  editValue: {},
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.EDIT:
      return { ...state, editValue: action.payload }
    case actions.UPDATE_STATE:
      if (isEmpty(state.editValue)) return state

      return produce(state, draftState => {
        Object.entries(action.payload).forEach(([key, value]) => {
          draftState.editValue[key] = value
        })
      })
    case actions.CLEAN_UP:
      return initialState
    default:
      return state
  }
}
