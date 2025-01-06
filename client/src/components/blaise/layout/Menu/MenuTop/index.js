import React from 'react'
import { connect } from 'react-redux'
import { Menu } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import classNames from 'classnames'
import style from './style.module.scss'
import { useSelectorMenu, generateMenuObject } from '../helper'

const mapStateToProps = ({ auth: { menu, settings, user } }) => ({
  menuData: menu.menuData,
  logo: settings.logo,
  menuColor: settings.menuColor,
  role_ids: user.role_ids,
})

const MenuTop = ({
  menuData = [],
  // location: { pathname },
  menuColor,
  logo,
}) => {
  const { selectedKeys, onSelectMenu } = useSelectorMenu()
  const menuItems = React.useMemo(() => {
    return generateMenuObject(menuData)
  }, [menuData])
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
            {/* <img
              src="resources/images/logo-blaise.png"
              className="mr-2"
              alt="Tsubasa Admin"
              style={{ maxWidth: '30px' }}
            /> */}
            <div className={style.name} style={{ maxWidth: '100%' }}>
              {logo}
            </div>
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
