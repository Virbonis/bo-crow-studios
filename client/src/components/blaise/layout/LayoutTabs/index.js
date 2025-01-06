import { Tabs } from 'antd'
import React, { useCallback, useEffect, Suspense } from 'react'
import Homepage from 'pages/auth/homepage'
import { connect } from 'react-redux'
import { useHistory, withRouter } from 'react-router-dom'
import { CloseOutlined } from '@ant-design/icons'
import actions from 'redux/auth/setting/actions'
// import ACL from 'components/blaise/system/ACL'
import { routes } from 'router'
import LayoutHelmet from '../LayoutHelmet'

const mapStateToProps = ({ auth: { settings, menu } }) => ({
  tabs: settings.tabs,
  activeTabKey: settings.activeTabKey,
  menuData: menu.menuData,
})

const mapDispatchToProps = dispatch => ({
  PushTab: payload =>
    dispatch({
      type: actions.PUSH_TAB,
      payload,
    }),
  PopTab: key =>
    dispatch({
      type: actions.POP_TAB,
      payload: { key },
    }),
  SetActiveTab: key =>
    dispatch({
      type: actions.SET_ACTIVE_TAB,
      payload: { key },
    }),
})

const LayoutTabs = ({
  menuData,
  tabs,
  activeTabKey,
  PushTab,
  PopTab,
  SetActiveTab,
  location: { pathname },
}) => {
  const history = useHistory()

  const route404 = React.useMemo(() => routes.find(e => e.path === '/auth/404'), [])

  console.log(tabs)

  useEffect(() => {
    if (tabs.length === 0 && pathname !== '/homepage')
      PushTab({
        key: '/homepage',
        label: 'Dashboard',
        children: <Homepage />,
        closeIcon: false,
      })

    if (pathname !== activeTabKey) {
      const findIndex = tabs.findIndex(e => e.key === pathname)
      if (findIndex === -1) {
        const routeItem = routes.find(e => e.path === pathname)
        const menuItem = menuData.find(e => e.url === pathname)

        if (menuItem) {
          PushTab({
            key: pathname,
            label: menuItem.title,
            children: (
              <Suspense fallback={null}>
                {/* <ACL roles={menuItem?.role_ids} bypass={routeItem?.bypass}> */}
                <LayoutHelmet />
                {!routeItem ? <route404.Component /> : <routeItem.Component />}
                {/* </ACL> */}
              </Suspense>
            ),
          })
        } else if (routeItem?.bypass) {
          // hanya ada dirouter
          PushTab({
            key: pathname,
            label: routeItem.title,
            closeIcon: pathname !== '/homepage' && <CloseOutlined />,
            children: (
              <Suspense fallback={null}>
                {/* <ACL bypass={routeItem?.bypass}> */}
                <LayoutHelmet />
                <routeItem.Component />
                {/* </ACL> */}
              </Suspense>
            ),
          })
        }
      } else {
        SetActiveTab(pathname)
      }
    }
  }, [pathname, tabs, activeTabKey, PushTab, SetActiveTab, menuData])

  const handleOnClick = useCallback(key => history.push(key), [history])
  const handleOnRemove = useCallback(
    key => {
      PopTab(key)
      const otherTab = tabs.filter(x => x.key !== key)
      history.push(otherTab[otherTab.length - 1]?.key)
    },
    [PopTab, history, tabs],
  )

  return (
    <Tabs
      type="editable-card"
      hideAdd
      animated={false}
      activeKey={activeTabKey}
      items={tabs}
      onChange={handleOnClick}
      onEdit={handleOnRemove}
    />
  )
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LayoutTabs))
