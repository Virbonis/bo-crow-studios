import actions from './actions'

const initialState = {
  loadingData: false,
  data: [],
  leagueData: [],
  specialData: [],
  specialDataScore: [],
  specialDataLiveScore: [],
  loadingSpecial: false,
  detailData: [],
  loadingDetailData: false,
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.CLEAN_UP:
      return initialState
    case actions.CLEAN_UP_SPECIAL:
      return {
        ...state,
        specialData: [],
        specialDataScore: [],
        specialDataLiveScore: [],
      }
    default:
      return state
  }
}
