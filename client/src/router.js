import React, { lazy, Suspense } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import LayoutHelmet from 'components/blaise/layout/LayoutHelmet'
import { connect } from 'react-redux'

import Layout from 'layouts'

import ACL from './components/blaise/system/ACL'
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
  // Admin
  {
    path: '/admin/audit',
    Component: lazy(() => import('pages/admin/audit')),
    exact: true,
  },
  {
    path: '/admin/application',
    Component: lazy(() => import('pages/admin/application')),
    exact: true,
  },
  {
    path: '/admin/menu',
    Component: lazy(() => import('pages/admin/menu')),
    exact: true,
  },
  {
    path: '/admin/user',
    Component: lazy(() => import('pages/admin/user')),
    exact: true,
  },
  {
    path: '/admin/permission',
    Component: lazy(() => import('pages/admin/permission')),
    exact: true,
  },
  {
    path: '/admin/role',
    Component: lazy(() => import('pages/admin/role')),
    exact: true,
  },
  {
    path: '/admin/user-teams',
    Component: lazy(() => import('pages/admin/user-teams')),
    exact: true,
  },
  {
    path: '/admin/user-login-session',
    Component: lazy(() => import('pages/admin/user-login-session')),
    exact: true,
  },
  {
    path: '/admin/force-logout-player-session',
    Component: lazy(() => import('pages/admin/force-logout-player-session')),
    exact: true,
  },
  {
    path: '/admin/operator-list',
    Component: lazy(() => import('pages/admin/operator-list')),
    exact: true,
  },
  {
    path: '/admin/operator-detail',
    Component: lazy(() => import('pages/admin/operator-detail')),
  },
  {
    path: '/admin/clear-redis',
    Component: lazy(() => import('pages/admin/clear-redis')),
  },
  // Master
  {
    path: '/master/profile',
    Component: lazy(() => import('pages/master/profile')),
    exact: true,
  },
  {
    path: '/master/profile1x2',
    Component: lazy(() => import('pages/master/profile-1x2')),
    exact: true,
  },
  {
    path: '/master/sport',
    Component: lazy(() => import('pages/master/sport')),
    exact: true,
  },
  {
    path: '/master/sport-sorting',
    Component: lazy(() => import('pages/master/sport-sorting')),
    exact: true,
  },
  {
    path: '/master/league',
    Component: lazy(() => import('pages/master/league')),
  },
  {
    path: '/master/league-group',
    Component: lazy(() => import('pages/master/league-group')),
    exact: true,
  },
  {
    path: '/master/league-hidden',
    Component: lazy(() => import('pages/master/league-hidden')),
  },
  {
    path: '/master/league-sequence',
    Component: lazy(() => import('pages/master/league-sequence')),
  },
  {
    path: '/master/currency',
    Component: lazy(() => import('pages/master/currency')),
  },
  {
    path: '/master/cash-category',
    Component: lazy(() => import('pages/master/cash-category')),
  },
  {
    path: '/master/cash-limit-profile',
    Component: lazy(() => import('pages/master/cash-limit-profile')),
  },
  {
    path: '/master/branch',
    Component: lazy(() => import('pages/master/branch')),
  },
  {
    path: '/master/branch-sport-limit',
    Component: lazy(() => import('pages/master/branch-sport-limit')),
  },
  {
    path: '/master/team',
    Component: lazy(() => import('pages/master/team')),
  },
  {
    path: '/master/region',
    Component: lazy(() => import('pages/master/region')),
  },
  {
    path: '/master/flag',
    Component: lazy(() => import('pages/master/flag')),
  },
  {
    path: '/master/league-duplicate-match',
    Component: lazy(() => import('pages/master/league-duplicate-match')),
  },
  // Customer
  {
    path: '/customer/customer-list',
    Component: lazy(() => import('pages/customer/customer-list')),
  },
  {
    path: '/customer/country-restriction',
    Component: lazy(() => import('pages/customer/country-restriction')),
  },
  {
    path: '/customer/add-agent-buyback',
    Component: lazy(() => import('pages/customer/add-agent-buyback')),
  },
  {
    path: '/customer/customer-buyback',
    Component: lazy(() => import('pages/customer/customer-buyback')),
  },
  // Match
  {
    path: '/match/auto-add-match',
    Component: lazy(() => import('pages/match/auto-add-match')),
  },
  {
    path: '/match/add-match',
    Component: lazy(() => import('pages/match/add-match')),
  },
  {
    path: '/match/match-list',
    Component: lazy(() => import('pages/match/match-list')),
  },
  {
    path: '/match/match-sequence',
    Component: lazy(() => import('pages/match/match-sequence')),
  },
  {
    path: '/match/scoring-match',
    Component: lazy(() => import('pages/match/scoring-match')),
  },
  {
    path: '/match/cancel-match',
    Component: lazy(() => import('pages/match/cancel-match')),
  },
  {
    path: '/match/process-match',
    Component: lazy(() => import('pages/match/process-match')),
  },
  {
    path: '/match/unprocess-match',
    Component: lazy(() => import('pages/match/unprocess-match')),
  },
  {
    path: '/match/match-profile',
    Component: lazy(() => import('pages/match/match-profile')),
  },
  {
    path: '/match/match-statistic',
    Component: lazy(() => import('pages/match/match-statistic')),
  },
  {
    path: '/match/list-auto-odds',
    Component: lazy(() => import('pages/match/list-auto-odds')),
  },
  {
    path: '/match/match-live-stream',
    Component: lazy(() => import('pages/match/match-live-stream')),
  },
  {
    path: '/match/popular-pick',
    Component: lazy(() => import('pages/match/popular-pick')),
  },
  {
    path: '/match/standings',
    Component: lazy(() => import('pages/match/standings')),
  },
  {
    path: '/match/knockouts',
    Component: lazy(() => import('pages/match/knockouts')),
  },
  {
    path: '/match/mapping-lottery',
    Component: lazy(() => import('pages/match/mapping-lottery')),
  },
  // BTI
  {
    path: '/bti/auto-add-match',
    Component: lazy(() => import('pages/bti/auto-add-match')),
  },
  {
    path: '/bti/bet-info',
    Component: lazy(() => import('pages/bti/bet-info')),
  },
  {
    path: '/bti/payout-tracker',
    Component: lazy(() => import('pages/bti/payout-tracker')),
  },
  {
    path: '/bti/process-breakdown-report',
    Component: lazy(() => import('pages/bti/process-breakdown-report')),
  },
  // Outright
  {
    path: '/outright/add-outright',
    Component: lazy(() => import('pages/outright/add-outright')),
  },
  {
    path: '/outright/outright-list',
    Component: lazy(() => import('pages/outright/outright-list')),
  },
  {
    path: '/outright/scoring-outright',
    Component: lazy(() => import('pages/outright/scoring-outright')),
  },
  {
    path: '/outright/cancel-outright',
    Component: lazy(() => import('pages/outright/cancel-outright')),
  },
  {
    path: '/outright/process-outright',
    Component: lazy(() => import('pages/outright/process-outright')),
  },
  {
    path: '/outright/unprocess-outright',
    Component: lazy(() => import('pages/outright/unprocess-outright')),
  },
  // Report
  {
    path: '/report/cash-flow-tracker',
    Component: lazy(() => import('pages/report/cash-flow-tracker')),
    exact: true,
  },
  {
    path: '/report/ledger',
    Component: lazy(() => import('pages/report/ledger')),
    exact: true,
  },
  {
    path: '/report/breakdown-report',
    Component: lazy(() => import('pages/report/breakdown-report')),
    exact: true,
  },
  {
    path: '/report/breakdown-report-ut',
    Component: lazy(() => import('pages/report/breakdown-report-ut')),
    exact: true,
  },
  {
    path: '/report/member-winloss',
    Component: lazy(() => import('pages/report/member-winloss')),
    exact: true,
  },
  {
    path: '/report/company-winloss',
    Component: lazy(() => import('pages/report/company-winloss')),
    exact: true,
  },
  {
    path: '/report/company-winloss-foreign',
    Component: lazy(() => import('pages/report/company-winloss-foreign')),
    exact: true,
  },
  {
    path: '/report/winloss-for-cash',
    Component: lazy(() => import('pages/report/winloss-for-cash')),
    exact: true,
  },
  {
    path: '/report/member-login',
    Component: lazy(() => import('pages/report/member-login')),
    exact: true,
  },
  {
    path: '/report/member-duplicate-ip',
    Component: lazy(() => import('pages/report/member-duplicate-ip')),
    exact: true,
  },
  {
    path: '/report/trader-performance',
    Component: lazy(() => import('pages/report/trader-performance')),
    exact: true,
  },
  {
    path: '/report/total-bet-account',
    Component: lazy(() => import('pages/report/total-bet-account')),
    exact: true,
  },
  {
    path: '/report/customer-vip',
    Component: lazy(() => import('pages/report/customer-vip')),
    exact: true,
  },
  {
    path: '/report/customer-vip-compliance',
    Component: lazy(() => import('pages/report/customer-vip-compliance')),
    exact: true,
  },
  {
    path: '/report/last-bet-report',
    Component: lazy(() => import('pages/report/last-bet-report')),
  },
  {
    path: '/report/odds-log',
    Component: lazy(() => import('pages/report/odds-log')),
  },
  {
    path: '/report/odds-log-1x2',
    Component: lazy(() => import('pages/report/odds-log-1x2')),
  },
  {
    path: '/report/cancelled-bet-list',
    Component: lazy(() => import('pages/report/cancelled-bet-list')),
  },
  {
    path: '/report/export',
    Component: lazy(() => import('pages/report/export')),
  },
  {
    path: '/report/fav-underdog-percentage',
    Component: lazy(() => import('pages/report/fav-underdog-percentage')),
  },
  {
    path: '/report/fund-transfer',
    Component: lazy(() => import('pages/report/fund-transfer')),
  },
  {
    path: '/report/member-pending-funds',
    Component: lazy(() => import('pages/report/member-pending-funds')),
  },
  {
    path: '/report/negative-balance',
    Component: lazy(() => import('pages/report/negative-balance')),
  },
  {
    path: '/report/settled-match-count',
    Component: lazy(() => import('pages/report/settled-match-count')),
  },
  {
    path: '/report/sb-platform-summary',
    Component: lazy(() => import('pages/report/sb-platform-summary')),
  },
  {
    path: '/report/lucky-number-winnning-result',
    Component: lazy(() => import('pages/report/lucky-number-winnning-result')),
  },
  // Trading
  {
    path: '/trading/mo-fly',
    Component: lazy(() => import('pages/trading/mo-fly')),
    exact: true,
  },
  {
    path: '/trading/mo-euro-fly',
    Component: lazy(() => import('pages/trading/mo-euro-fly')),
    exact: true,
  },
  {
    path: '/trading/mo-cs-fly',
    Component: lazy(() => import('pages/trading/mo-cs-fly')),
    exact: true,
  },
  {
    path: '/trading/mo-oe-fly',
    Component: lazy(() => import('pages/trading/mo-oe-fly')),
    exact: true,
  },
  {
    path: '/trading/mo-os-fly',
    Component: lazy(() => import('pages/trading/mo-os-fly')),
    exact: true,
  },
  {
    path: '/trading/mo-tennis-fly',
    Component: lazy(() => import('pages/trading/mo-tennis-fly')),
    exact: true,
  },
  {
    path: '/trading/mo-quick-fly',
    Component: lazy(() => import('pages/trading/mo-quick-fly')),
    exact: true,
  },
  {
    path: '/trading/mo-view-fly',
    Component: lazy(() => import('pages/trading/mo-view-fly')),
  },
  {
    path: '/trading/deadball-fly',
    Component: lazy(() => import('pages/trading/deadball-fly')),
    exact: true,
  },
  {
    path: '/trading/deadball-special-fly',
    Component: lazy(() => import('pages/trading/deadball-special-fly')),
    exact: true,
  },
  {
    path: '/trading/mix-parlay-fly',
    Component: lazy(() => import('pages/trading/mix-parlay-fly')),
    exact: true,
  },
  {
    path: '/trading/instant-bet-fly',
    Component: lazy(() => import('pages/trading/instant-bet-fly')),
    exact: true,
  },
  {
    path: '/trading/member-online',
    Component: lazy(() => import('pages/trading/member-online')),
  },
  {
    path: '/trading/trading-info',
    Component: lazy(() => import('pages/trading/trading-info')),
  },
  {
    path: '/trading/forecast-fly',
    Component: lazy(() => import('pages/trading/forecast-fly')),
  },
  {
    path: '/trading/forecast-archive-fly',
    Component: lazy(() => import('pages/trading/forecast-archive-fly')),
  },
  {
    path: '/trading/forecast-bet-amount-fly',
    Component: lazy(() => import('pages/trading/forecast-bet-amount-fly')),
  },
  {
    path: '/trading/forecast-archive-bet-amount-fly',
    Component: lazy(() => import('pages/trading/forecast-archive-bet-amount-fly')),
  },
  {
    path: '/trading/bet-enquiry',
    Component: lazy(() => import('pages/trading/bet-enquiry')),
  },

  {
    path: '/trading/bet-listing',
    Component: lazy(() => import('pages/trading/bet-listing')),
  },
  {
    path: '/trading/void-ticket',
    Component: lazy(() => import('pages/trading/void-ticket')),
  },
  {
    path: '/trading/online-list',
    Component: lazy(() => import('pages/trading/online-list')),
  },
  {
    path: '/trading/my-matches',
    Component: lazy(() => import('pages/trading/my-matches')),
  },
  {
    path: '/trading/user-team-matches',
    Component: lazy(() => import('pages/trading/user-team-matches')),
  },
  {
    path: '/trading/leeching-assignment',
    Component: lazy(() => import('pages/trading/leeching-assignment')),
  },
  {
    path: '/trading/running-ball-fly',
    Component: lazy(() => import('pages/trading/running-ball-fly')),
  },
  {
    path: '/trading/running-ball-quick-fly',
    Component: lazy(() => import('pages/trading/running-ball-quick-fly')),
  },
  {
    path: '/trading/match-assignment-fly',
    Component: lazy(() => import('pages/trading/match-assignment-fly')),
    exact: true,
  },
  {
    path: '/trading/match-assignment-pick-fly',
    Component: lazy(() => import('pages/trading/match-assignment-pick-fly')),
    exact: true,
  },
  {
    path: '/trading/match-assignment-ro-fly',
    Component: lazy(() => import('pages/trading/match-assignment-ro-fly')),
    exact: true,
  },
  {
    path: '/trading/request-more-ogt-fly',
    Component: lazy(() => import('pages/trading/request-more-ogt-fly')),
    exact: true,
  },

  // Tools
  {
    path: '/tools/sportsbook-setting',
    Component: lazy(() => import('pages/tools/sportsbook-setting')),
  },
  {
    path: '/tools/news-ticker',
    Component: lazy(() => import('pages/tools/news-ticker')),
  },
  {
    path: '/tools/reset-search-engine',
    Component: lazy(() => import('pages/tools/reset-search-engine')),
  },
  {
    path: '/tools/mapping-league',
    Component: lazy(() => import('pages/tools/mapping-league')),
  },
  {
    path: '/tools/mapping-team',
    Component: lazy(() => import('pages/tools/mapping-team')),
  },
  {
    path: '/tools/mapping-rball/league',
    Component: lazy(() => import('pages/tools/mapping-rball/league')),
  },
  {
    path: '/tools/mapping-rball/team',
    Component: lazy(() => import('pages/tools/mapping-rball/team')),
  },
  {
    path: '/tools/mapping-rball/match',
    Component: lazy(() => import('pages/tools/mapping-rball/match')),
  },
  {
    path: '/tools/mapping-bg/match',
    Component: lazy(() => import('pages/tools/mapping-bg/match')),
  },
  {
    path: '/tools/mapping-bg/game-event',
    Component: lazy(() => import('pages/tools/mapping-bg/game-event')),
  },
  {
    path: '/tools/mapping-bb',
    Component: lazy(() => import('pages/tools/mapping-bb')),
  },
  {
    path: '/tools/mapping-bet-radar',
    Component: lazy(() => import('pages/tools/mapping-bet-radar')),
  },
  {
    path: '/tools/mapping-glive-stream',
    Component: lazy(() => import('pages/tools/mapping-glive-stream')),
  },
  {
    path: '/tools/leech-assign',
    Component: lazy(() => import('pages/tools/leech-assign')),
  },
  {
    path: '/tools/accept-rejected-ticket',
    Component: lazy(() => import('pages/tools/accept-rejected-ticket')),
  },
  {
    path: '/tools/breakdown-patching',
    Component: lazy(() => import('pages/tools/breakdown-patching')),
  },
  {
    path: '/tools/bbz-reset',
    Component: lazy(() => import('pages/tools/bbz-reset')),
  },
  {
    path: '/tools/bbz-channel-monitoring',
    Component: lazy(() => import('pages/tools/bbz-channel-monitoring')),
  },
  {
    path: '/tools/bbz-match-list',
    Component: lazy(() => import('pages/tools/bbz-match-list')),
  },
  {
    path: '/tools/bbz-action-log',
    Component: lazy(() => import('pages/tools/bbz-action-log')),
  },
  {
    path: '/tools/bbz-market',
    Component: lazy(() => import('pages/tools/bbz-market')),
  },
  {
    path: '/tools/bbz-market-log',
    Component: lazy(() => import('pages/tools/bbz-market-log')),
  },
  {
    path: '/tools/bbz-incident',
    Component: lazy(() => import('pages/tools/bbz-incident')),
  },
  {
    path: '/tools/im-reset',
    Component: lazy(() => import('pages/tools/im-reset')),
  },
  {
    path: '/tools/im-match-list',
    Component: lazy(() => import('pages/tools/im-match-list')),
  },
  {
    path: '/tools/im-action-log',
    Component: lazy(() => import('pages/tools/im-action-log')),
  },
  {
    path: '/tools/im-market',
    Component: lazy(() => import('pages/tools/im-market')),
  },
  {
    path: '/tools/sis-market',
    Component: lazy(() => import('pages/tools/sis-market')),
  },
  {
    path: '/tools/sis-action-log',
    Component: lazy(() => import('pages/tools/sis-action-log')),
  },
  {
    path: '/tools/sis-market-log',
    Component: lazy(() => import('pages/tools/sis-market-log')),
  },
  {
    path: '/tools/sis-match-list',
    Component: lazy(() => import('pages/tools/sis-match-list')),
  },
  // History
  {
    path: '/report/cash-flow-tracker/hist',
    Component: lazy(() => import('pages/report/cash-flow-tracker/index-hist')),
  },
  {
    path: '/report/ledger/hist',
    Component: lazy(() => import('pages/report/ledger/index-hist')),
  },
  {
    path: '/report/breakdown-report/hist',
    Component: lazy(() => import('pages/report/breakdown-report/index-hist')),
  },
  {
    path: '/report/breakdown-report-ut/hist',
    Component: lazy(() => import('pages/report/breakdown-report-ut/index-hist')),
  },
  {
    path: '/report/member-winloss/hist',
    Component: lazy(() => import('pages/report/member-winloss/index-hist')),
  },
  {
    path: '/report/company-winloss/hist',
    Component: lazy(() => import('pages/report/company-winloss/index-hist')),
  },
  {
    path: '/report/winloss-for-cash/hist',
    Component: lazy(() => import('pages/report/winloss-for-cash/index-hist')),
  },
  {
    path: '/report/trader-performance/hist',
    Component: lazy(() => import('pages/report/trader-performance/index-hist')),
  },
  {
    path: '/trading/bet-enquiry/hist',
    Component: lazy(() => import('pages/trading/bet-enquiry/index-hist')),
  },
  {
    path: '/admin/audit/hist',
    Component: lazy(() => import('pages/admin/audit/index-hist')),
  },
  // Seamless
  {
    path: '/seamless/operator-seamless',
    Component: lazy(() => import('pages/seamless/operator-seamless')),
  },
  {
    path: '/seamless/operator-setting',
    Component: lazy(() => import('pages/seamless/operator-setting')),
  },
  {
    path: '/seamless/operator-maintenance',
    Component: lazy(() => import('pages/seamless/operator-maintenance')),
  },
  {
    path: '/seamless/failed-payout',
    Component: lazy(() => import('pages/seamless/failed-payout')),
  },
  {
    path: '/seamless/list-cancel-game',
    Component: lazy(() => import('pages/seamless/list-cancel-game')),
  },
  {
    path: '/seamless/list-payout-info',
    Component: lazy(() => import('pages/seamless/list-payout-info')),
  },
  {
    path: '/seamless/bet-request-info',
    Component: lazy(() => import('pages/seamless/bet-request-info')),
  },
  {
    path: '/seamless/list-payout-tracker',
    Component: lazy(() => import('pages/seamless/list-payout-tracker')),
  },
  // window
  {
    path: '/trading/mo-match-edit-fly',
    Component: lazy(() => import('pages/trading/mo-match-edit-fly')),
    exact: true,
    bypass: true,
  },
  {
    path: '/trading/mo-accept-reject-fly',
    Component: lazy(() => import('pages/trading/mo-accept-reject-fly')),
    exact: true,
    bypass: true,
  },
  {
    path: '/trading/mo-accept-reject-view-fly',
    Component: lazy(() => import('pages/trading/mo-accept-reject-view-fly')),
    exact: true,
    bypass: true,
  },
  {
    path: '/match/scoring-match-special-fly',
    Component: lazy(() => import('pages/match/scoring-match-special-fly')),
    exact: true,
    bypass: true,
  },
  {
    path: '/match/process-match-special-fly',
    Component: lazy(() => import('pages/match/process-match-special-fly')),
    exact: true,
    bypass: true,
  },
  {
    path: '/match/unprocess-match-special-fly',
    Component: lazy(() => import('pages/match/unprocess-match-special-fly')),
    exact: true,
    bypass: true,
  },
  {
    path: '/trading/mo-scoring-detail-fly',
    Component: lazy(() => import('pages/trading/mo-scoring-detail-fly')),
    // exact: true,
    bypass: true,
  },
  {
    path: '/trading/odds-log-fly',
    Component: lazy(() => import('pages/trading/odds-log-fly')),
    // exact: true,
    bypass: true,
  },
  {
    path: '/trading/mo-other-game-type-fly',
    Component: lazy(() => import('pages/trading/mo-other-game-type-fly')),
    // exact: true,
    bypass: true,
  },
  {
    path: '/trading/bet-list-fly',
    Component: lazy(() => import('pages/trading/bet-list-fly')),
    // exact: true,
    bypass: true,
  },
]

const mapStateToProps = ({ auth: { settings, menu } }) => ({
  routerAnimation: settings.routerAnimation,
  menu,
})

const Router = ({ history, menu, routerAnimation }) => {
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
                    {routes.map(({ path, Component, exact, bypass }) => (
                      <Route
                        path={path}
                        key={path}
                        exact={exact}
                        render={() => {
                          return (
                            <div className={routerAnimation}>
                              <Suspense fallback={null}>
                                <ACL
                                  roles={menu.menuData?.find(x => x.url === path)?.role_ids} // eslint-disable-line camelcase
                                  bypass={bypass}
                                >
                                  <LayoutHelmet />
                                  <Component />
                                </ACL>
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
