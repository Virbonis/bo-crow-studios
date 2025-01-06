import produce from 'immer'
import actions from './actions'

const initialState = {
  list_oe: [],
  list_wnw: [],
  list_special_gt: [],
  list_special_other: [],
  list_cs: {
    CS: [],
    CSLive: [],
  },
  data_HT: [],
  data_FT: [],
  data_QT: [],
  data_QT1: [],
  data_QT2: [],
  data_QT3: [],
  data_QT4: [],
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
    case actions.CLEAN_UP_BASKET:
      return produce(state, draftState => {
        draftState[`data_${action.payload.key}`] = []
      })

    default:
      return state
  }
}
