import React, { lazy, Suspense } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import LayoutHelmet from 'components/blaise/layout/LayoutHelmet'
import { connect } from 'react-redux'

import Layout from 'layouts'

// import ACL from './components/blaise/system/ACL'
// import { Switch } from  'react-router-dom'

export const routes = [
  // Auth Pages
  {
    path: '/auth/login',
    Component: lazy(() => import('pages/auth/login')),
    exact: true,
    bypass: true,
  },
  {
    path: '/auth/404',
    Component: lazy(() => import('pages/auth/404')),
    exact: true,
    bypass: true,
  },
  {
    path: '/auth/500',
    Component: lazy(() => import('pages/auth/500')),
    exact: true,
  },
  // Home Page
  {
    path: '/homepage',
    title: 'Dashboard',
    Component: lazy(() => import('pages/auth/homepage')),
    exact: true,
    bypass: true,
  },
  {
    path: '/my-profile',
    title: 'My Profile',
    Component: lazy(() => import('pages/auth/my-profile')),
    exact: true,
    bypass: true,
  },
  // Master
  {
    path: '/master/profile',
    Component: lazy(() => import('pages/master/profile')),
    exact: true,
  },
  {
    path: '/test',
    Component: lazy(() => import('pages/test/test1')),
    exact: true,
  },
]

const mapStateToProps = ({ auth: { settings, menu } }) => ({
  routerAnimation: settings.routerAnimation,
  menu,
})

const Router = ({ history, routerAnimation }) => {
  return (
    <ConnectedRouter history={history}>
      <Layout>
        <Route
          render={state => {
            const { location } = state
            return (
              <SwitchTransition>
                <CSSTransition
                  key={location.pathname}
                  appear
                  classNames={routerAnimation}
                  timeout={routerAnimation === 'none' ? 0 : 300}
                >
                  <Switch location={location}>
                    <Route exact path="/" render={() => <Redirect to="/homepage" />} />
                    {routes.map(({ path, Component, exact }) => (
                      <Route
                        path={path}
                        key={path}
                        exact={exact}
                        render={() => {
                          return (
                            <div className={routerAnimation}>
                              <Suspense fallback={null}>
                                {/* <ACL
                                  roles={menu.menuData?.find(x => x.url === path)?.role_ids} // eslint-disable-line camelcase
                                  bypass={bypass}
                                > */}
                                <LayoutHelmet />
                                <Component />
                                {/* </ACL> */}
                              </Suspense>
                            </div>
                          )
                        }}
                      />
                    ))}
                    <Redirect to="/auth/404" />
                  </Switch>
                </CSSTransition>
              </SwitchTransition>
            )
          }}
        />
      </Layout>
    </ConnectedRouter>
  )
}

export default connect(mapStateToProps)(Router)
