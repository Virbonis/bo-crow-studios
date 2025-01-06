import React from 'react'
import { connect } from 'react-redux'
import { Menu } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import classNames from 'classnames'
import style from './style.module.scss'
import { generateMenuObject, useSelectorMenu } from '../helper'

const mapStateToProps = ({ auth: { menu, settings, user } }) => ({
  menuTree: menu.menuTree,
  logo: settings.logo,
  menuColor: settings.menuColor,
  role_ids: user.role_ids,
})

const MenuTop = ({
  menuTree = [],
  // location: { pathname },
  menuColor,
  logo,
  role_ids,
}) => {
  const menuItems = React.useMemo(() => {
    return menuTree.map(menuItem => generateMenuObject(menuItem, role_ids))
  }, [menuTree, role_ids])
  const { selectedKeys, onSelectMenu } = useSelectorMenu()
  return (
    <div
      className={classNames(`w-100 align-items-center ${style.menu}`, {
        [style.white]: menuColor === 'white',
        [style.gray]: menuColor === 'gray',
        [style.dark]: menuColor === 'dark',
      })}
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

      <div className={style.navigation}>
        <Menu
          mode="horizontal"
          items={menuItems}
          selectedKeys={[selectedKeys]}
          onSelect={onSelectMenu}
        />
      </div>
    </div>
  )
}

export default withRouter(connect(mapStateToProps)(MenuTop))
