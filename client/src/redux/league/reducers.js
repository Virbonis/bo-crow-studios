import produce from 'immer'
import actions from './actions'

const initialState = {
  loading: false,
  select: [],
  loadingSearch: false,
  loadingData: false,
  loadingExport: false,
  loadingRefresh: false,
  listComp: [],
  listCategory: [],
  listGroup: [],
  item: [],
  data: [],
  detail: {},
  dataExport: [],
  dataSearch: [],
  select_in_autoaddmatch: [],
  select_in_addmatch: [],
  select_in_matchlist: [],
  select_in_mapping_lottery: [],
  select_in_match_profile: [],
  select_in_match_statistic: [],
  select_in_scoring_match: [],
  select_in_process_match: [],
  select_in_unprocess_match: [],
  select_in_outright: [],
  select_in_mapping_league: [],
  select_league_map_match: [],
  select_league_map_match_bg: [],
  select_in_mapping_builder: [],
  select_in_online_list: [],
  select_in_instantbet: [],
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
    case actions.CLEAN_UP_SEARCH:
      return { ...state, dataSearch: [] }
    default:
      return state
  }
}
