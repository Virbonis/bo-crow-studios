import produce from 'immer'
import actions from './actions'

const initialState = {
  loading: false,
  loadingData: false,
  data: [],
  dataList: {},
  dataEdit: {},
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
    case actions.CLEAN_UP_LIST:
      return { ...state, [`dataList_${action.payload.outright_id}`]: [] }
    default:
      return state
  }
}
