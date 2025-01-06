import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Layout } from 'antd'
import classNames from 'classnames'
import store from 'store'
import PerfectScrollbar from 'react-perfect-scrollbar'
import style from './style.module.scss'
import { generateMenuObject, useSelectorMenu } from '../helper'

const mapStateToProps = ({ auth: { menu, settings, user } }) => ({
  menuTree: menu.menuTree,
  isMenuCollapsed: settings.isMenuCollapsed,
  isMobileView: settings.isMobileView,
  isMenuUnfixed: settings.isMenuUnfixed,
  isMenuShadow: settings.isMenuShadow,
  leftMenuWidth: settings.leftMenuWidth,
  menuColor: settings.menuColor,
  logo: settings.logo,
  // eslint-disable-next-line camelcase
  role_ids: user.role_ids,
})

const MenuLeft = ({
  dispatch,
  menuTree = [],
  // location: { pathname },
  isMenuCollapsed,
  isMobileView,
  isMenuUnfixed,
  isMenuShadow,
  leftMenuWidth,
  menuColor,
  logo,
  // eslint-disable-next-line camelcase
  role_ids,
}) => {
  const [openedKeys, setOpenedKeys] = useState(store.get('app.menu.openedKeys') || [])
  const onCollapse = (value, type) => {
    if (type === 'responsive' && isMenuCollapsed) {
      return
    }
    dispatch({
      type: 'auth/settings/CHANGE_SETTING',
      payload: {
        setting: 'isMenuCollapsed',
        value: !isMenuCollapsed,
      },
    })
    setOpenedKeys([])
  }
  const onOpenChange = keys => {
    store.set('app.menu.openedKeys', keys)
    setOpenedKeys(keys)
  }

  const menuSettings = isMobileView
    ? {
        width: leftMenuWidth,
        collapsible: false,
        collapsed: false,
        onCollapse,
      }
    : {
        width: leftMenuWidth,
        collapsible: true,
        collapsed: isMenuCollapsed,
        onCollapse,
        breakpoint: 'lg',
      }

  const menuItems = React.useMemo(() => {
    return menuTree.map(menuItem => generateMenuObject(menuItem, role_ids))
  }, [menuTree, role_ids])

  const { selectedKeys, onSelectMenu } = useSelectorMenu()
  return (
    <Layout.Sider
      {...menuSettings}
      className={classNames(`${style.menu}`, style[menuColor], {
        [style.unfixed]: isMenuUnfixed,
        [style.shadow]: isMenuShadow,
      })}
    >
      <div
        className={style.menuOuter}
        style={{
          width: isMenuCollapsed && !isMobileView ? 80 : leftMenuWidth,
          height: isMobileView || isMenuUnfixed ? 'calc(100% - 64px)' : 'calc(100% - 110px)',
        }}
      >
        <Link to="/homepage">
          <div className={style.logoContainer}>
            <div className={style.logo}>
              <img
                src="resources/images/logo-blaise.png"
                className="mr-2"
                alt="Tsubasa Admin"
                style={{ maxWidth: '30px' }}
              />
              <div className={style.name}>{logo}</div>
            </div>
          </div>
        </Link>
        <PerfectScrollbar>
          <Menu
            openKeys={openedKeys}
            onOpenChange={onOpenChange}
            className={style.navigation}
            inlineIndent={12}
            mode="inline"
            items={menuItems}
            selectedKeys={[selectedKeys]}
            onSelect={onSelectMenu}
          />
        </PerfectScrollbar>
      </div>
    </Layout.Sider>
  )
}

export default withRouter(connect(mapStateToProps)(MenuLeft))
