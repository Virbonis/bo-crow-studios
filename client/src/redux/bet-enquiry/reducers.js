import actions from './actions'

const initialState = {
  loadingData_Post: false,
  loadingDownload_Post: false,
  data_Post: [],
  loadingData_Hist: false,
  loadingDownload_Hist: false,
  data_Hist: [],

  loadingPopUpData: false,
  popUpDataParlay: [],
  popUpDataLottery: [],
  popUpDataResult: [],
  popUpDataBetResultBuilder: {},
  summaryPopUp: 0,
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.CLEAN_UP_POST:
      return {
        ...state,
        data_Post: [],
      }
    case actions.CLEAN_UP_HIST:
      return {
        ...state,
        data_Hist: [],
      }
    case actions.CLEAN_UP_DETAIL:
      return {
        ...state,
        popUpDataParlay: [],
        popUpDataLottery: [],
        summaryPopUp: 0,
      }
    case actions.CLEAN_UP_RESULT:
      return {
        ...state,
        popUpDataResult: [],
        popUpDataBetResultBuilder: {},
      }
    default:
      return state
  }
}
