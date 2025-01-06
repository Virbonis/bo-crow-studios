import store from 'store'
import actions from './actions'

const STORED_SETTINGS = storedSettings => {
  const settings = {}
  Object.keys(storedSettings).forEach(key => {
    const item = store.get(`app.settings.${key}`)
    settings[key] = typeof item !== 'undefined' ? item : storedSettings[key]
  })
  return settings
}

const initialState = {
  ...STORED_SETTINGS({
    authProvider: 'jwt', // firebase, jwt
    logo: 'SBAdmin Backoffice',
    locale: 'en-US',
    isSidebarOpen: false,
    isSupportChatOpen: false,
    isMobileView: false,
    isMobileMenuOpen: false,
    isMenuCollapsed: false,
    menuLayoutType: 'left', // left, top, nomenu
    routerAnimation: 'slide-fadein-up', // none, slide-fadein-up, slide-fadein-right, fadein, zoom-fadein
    menuColor: 'white', // white, dark, gray
    theme: 'default', // default, dark
    authPagesColor: 'white', // white, gray, image
    primaryColor: '#2475B2', // Deep Azure
    leftMenuWidth: 280,
    isMenuUnfixed: false,
    isMenuShadow: true,
    isTopbarFixed: true,
    isGrayTopbar: false,
    isContentMaxWidth: false,
    isAppMaxWidth: false,
    isGrayBackground: false,
    isCardShadow: true,
    isSquaredBorders: false,
    isBorderless: false,
    activeTab: 0,
    tabs: [],
    notification: true,
  }),
}

export default function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.PUSH_TAB:
      return {
        ...state,
        tabs: [...state.tabs, action.payload],
        activeTabKey: action.payload.key,
      }
    case actions.POP_TAB:
      return {
        ...state,
        tabs: [...state.tabs.filter(tab => tab.key !== action.payload.key)],
        activeTabKey: state.tabs[state.tabs.length - 1]?.key,
      }
    case actions.SET_ACTIVE_TAB:
      return {
        ...state,
        activeTabKey: action.payload.key,
      }
    default:
      return state
  }
}
