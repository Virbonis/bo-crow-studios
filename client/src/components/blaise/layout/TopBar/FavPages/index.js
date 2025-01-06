import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import { Dropdown, Input, Tooltip, message } from 'antd'
import PerfectScrollbar from 'react-perfect-scrollbar'
import store from 'store'
import style from './style.module.scss'

const mapStateToProps = ({ auth: { menu, user } }) => ({
  menuData: menu.menuData,
  role_ids: user.role_ids,
})

const FavPages = ({
  menuData = [],
  intl: { formatMessage },
  // eslint-disable-next-line camelcase
}) => {
  const [searchText, setSearchText] = useState('')
  const [favs, setFavs] = useState(store.get('app.topbar.favs') || [])
  const [pagesList, setPagesList] = useState([])

  useEffect(() => {
    const menuList = menuData
      .map(e => {
        if (e.parent) {
          const parentItem = menuData.find(v => v.title === e.parent)
          if (parentItem && parentItem.icon) {
            return { ...e, icon: parentItem.icon }
          }
        }
        return e
      })
      .filter(e => e.url)
    setPagesList(menuList)
  }, [menuData])

  const changeSearchText = e => {
    setSearchText(e.target.value)
  }

  const setFav = (e, item) => {
    e.preventDefault()
    e.stopPropagation()
    const isActive = favs.some(child => child.url === item.url)
    if (isActive) {
      const filtered = favs.filter(child => child.url !== item.url)
      store.set('app.topbar.favs', filtered)
      setFavs(filtered)
      return
    }
    if (favs.length >= 3) {
      message.info('Only three pages can be added to your bookmarks.')
      return
    }
    const items = [...favs]
    items.push({ ...item, key: item.menu_id })
    store.set('app.topbar.favs', items)
    setFavs(items)
  }

  const generatePageList = () => {
    const searchTextProcessed = searchText ? searchText.toUpperCase() : ''
    return pagesList.map(item => {
      const isActive = favs.some(child => child.url === item.url)
      if (!item.title.toUpperCase().includes(searchTextProcessed) && searchTextProcessed) {
        return null
      }
      return (
        <Link to={item.url} className={style.link} key={item.menu_id}>
          <div
            className={`${style.setIcon} ${isActive ? style.setIconActive : ''}`}
            onClick={e => setFav(e, item)}
            role="button"
            tabIndex="0"
            onFocus={e => {
              e.preventDefault()
            }}
            onKeyPress={e => setFav(e, item)}
          >
            <i className="fe fe-star" />
          </div>
          <span>
            <i className={`mr-2 ${item.icon}`} />
            {item.title}
          </span>
        </Link>
      )
    })
  }

  const menu = () => (
    <div className="card cui__utils__shadow width-300">
      <div className="card-body p-1 ">
        <div className="p-2">
          <Input
            placeholder={formatMessage({ id: 'topBar.findPages' })}
            value={searchText}
            onChange={changeSearchText}
            allowClear
          />
        </div>
        <div className="height-200">
          <PerfectScrollbar>
            <div className="px-2 pb-2">{generatePageList(searchText)}</div>
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  )
  return (
    <div className={style.container}>
      {favs.map(item => {
        return (
          <Tooltip key={item.menu_id} placement="bottom" title={item.title}>
            <Link to={item.url} className={`${style.item} mr-3`}>
              <i className={`${style.icon} ${item.icon}`} />
            </Link>
          </Tooltip>
        )
      })}
      <Tooltip placement="bottom" title="Bookmarks">
        <Dropdown dropdownRender={menu} trigger={['click']} placement="bottomLeft">
          <span className={style.item}>
            <i className={`${style.icon} fe fe-star`} />
          </span>
        </Dropdown>
      </Tooltip>
    </div>
  )
}

export default injectIntl(connect(mapStateToProps)(FavPages))
