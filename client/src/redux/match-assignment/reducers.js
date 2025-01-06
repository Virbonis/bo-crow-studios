import produce from 'immer'
import actions from './actions'

const initialState = {
  loadingTrader: false,
  traders: [],
  loadingCounter: false,
  dataCounter: [],

  loadingLeague: false,
  dataLeague: [],
  defaultSelectedLeague: [],

  loadingMatch: false,
  dataMatch: [],
  defaultSelectedMatch: [],

  loadingDetail: false,
  dataDetail: [],
  loadingLog: false,
  dataLog: [],
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.SET_SELECTED_LEAGUE:
      return produce(state, draftState => {
        const index = draftState.dataLeague.findIndex(e => e.league_id === action.payload.league_id)
        draftState.dataLeague[index].checked = action.payload.checked
      })
    case actions.CLEAN_UP_LOG:
      return { ...state, dataLog: [] }
    case actions.CLEAN_UP:
      return initialState
    default:
      return state
  }
}
