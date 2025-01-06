import './components/kit/vendors/antd/themes/default.less' // default theme antd components
import './components/kit/vendors/antd/themes/dark.less' // dark theme antd components
import './global.scss' // app & third-party component styles

import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider, theme as antdTheme, notification } from 'antd'
import { createHashHistory } from 'history'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider, useSelector } from 'react-redux'
// import { logger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import { QueryClient, QueryClientProvider } from 'react-query'
import { routerMiddleware } from 'connected-react-router'
import Localization from 'localization'

import reducers from './redux/reducers'
import sagas from './redux/sagas'
import Router from './router'
import * as serviceWorker from './serviceWorker'
import './index-extension'

// mocking api
import 'services/axios/fakeApi'

// middlewared
const history = createHashHistory()
const sagaMiddleware = createSagaMiddleware()
const routeMiddleware = routerMiddleware(history)
const middlewares = [sagaMiddleware, routeMiddleware]
const queryClient = new QueryClient()

// if (process.env.NODE_ENV === 'development') {
//   middlewares.push(logger)
// }
const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose
const store = createStore(reducers(history), composeEnhancers(applyMiddleware(...middlewares)))
sagaMiddleware.run(sagas)

const root = ReactDOM.createRoot(document.getElementById('root'))

const MyApp = () => {
  const themeRedux = useSelector(state => state.auth.settings.theme)
  const isLight = themeRedux === 'default'

  const notifState = useSelector(state => state.auth.settings.notification)
  notification.config({ placement: notifState ? 'topRight' : '-' })

  return (
    <ConfigProvider
      componentSize="small"
      theme={{
        algorithm: [antdTheme[`${themeRedux}Algorithm`], antdTheme.compactAlgorithm],
        components: {
          Menu: {
            itemHeight: 20,
            itemSelectedColor: 'var(--kit-color-primary)',
          },
          Table: {
            rowSelectedBg: isLight ? '#e6f4ff' : '#000040',
            headerBg: 'var(--kit-color-primary)',
            headerColor: '#fff',
            bodySortBg: isLight ? '#f0f0f0' : '#232135',
            headerSortActiveBg: 'var(--kit-color-primary)',
            rowHoverBg: isLight ? '#e6e6e6' : '#1b1928',
            borderColor: isLight ? '#d9d9d9' : '#30363d',
          },
          Form: {
            itemMarginBottom: 0,
          },
          Tabs: {
            horizontalMargin: 0,
            colorBgContainer: 'var(--kit-color-primary)',
            itemSelectedColor: '#fff',
          },
          Select: {
            optionFontSize: 'unset',
            optionHeight: 20,
            optionPadding: '2px 8px',
          },
          InputNumber: {
            colorText: 'inherit',
          },
          Button: {
            colorPrimary: 'var(--kit-color-primary)',
          },
          Checkbox: {
            colorPrimary: 'var(--kit-color-primary)',
          },
          Switch: {
            colorPrimary: 'var(--kit-color-primary)',
          },
          Radio: {
            colorPrimary: 'var(--kit-color-primary)',
          },
        },
        token: {
          // fontSize: 'unset',
          // fontFamily: '"lucida grande",tahoma,verdana,arial,sans-serif',
          fontFamily: '"Tahoma", sans-serif',
          colorBgBase: isLight ? '#ffffff' : '#232135',
          colorPrimary: '#2475B2',
          // colorLink: 'var(--kit-color-primary)',
        },
      }}
    >
      <Localization>
        <Router history={history} />
      </Localization>
    </ConfigProvider>
  )
}

root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <MyApp />
    </Provider>
  </QueryClientProvider>,
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
export { store, history, queryClient }
