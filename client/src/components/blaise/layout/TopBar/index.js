import React from 'react'
import FavPages from './FavPages'
// import Search from './Search'
import ProfileMenu from './ProfileMenu'
import style from './style.module.scss'
import SearchMenu from './SearchMenu'
import Clock from './Clock'
// import SwitchTheme from './SwitchTheme'

const TopBar = () => {
  return (
    <div className={`${style.topbar} justify-content-between`}>
      <SearchMenu />
      <div className="d-flex justify-content-end align-items-center">
        <div className="mr-4">
          <Clock />
        </div>
        <div className="mr-4">
          <FavPages />
        </div>
        {/* <div className="mr-auto">
          <Search />
        </div> */}
        {/* <div className="ml-auto mr-5">
          <SwitchTheme />
        </div> */}
        <div className="">
          <ProfileMenu />
        </div>
      </div>
    </div>
  )
}

export default TopBar
