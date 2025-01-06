import actions from './actions'

const initialState = {
  loading: false,
  data: {},
  specialCode: [],
  dataEdit: {},
  dataDetail: [],
  dataInfo: {},
  dataListSubMatch: {},

  dataMatchSpecial: [],
  dataMatchSpecialMore: [],
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.EDIT:
      return { ...state, editValue: action.payload }
    case actions.CLEAN_UP:
      return initialState
    case actions.CLEAN_UP_LIST_SUB_MATCH:
      return { ...state, dataListSubMatch: {} }
    case actions.CLEAN_UP_DATA_EDIT:
      return { ...state, dataEdit: {} }
    case actions.CLEAN_UP_DETAIL_SPECIAL:
      return { ...state, dataDetail: [] }
    case actions.CLEAN_UP_MATCH_SPECIAL:
      return { ...state, dataMatchSpecial: [] }
    case actions.CLEAN_UP_MATCH_SPECIAL_MORE:
      return { ...state, dataMatchSpecialMore: [] }
    default:
      return state
  }
}
