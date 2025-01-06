import React from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import style from './MenuLeft/style.module.scss'

export const generateMenuObject = (menuItem, role_ids) => {
  if (menuItem.role_ids && !menuItem.role_ids.some(r => role_ids.includes(r))) {
    return null
  }

  const menuObject = {
    key: menuItem.menu_id,
    disabled: menuItem.disabled,
    title: menuItem.title,
    label: (
      <a>
        <span className={style.title}>{menuItem.title}</span>
        {menuItem.count && <span className="badge badge-success ml-2">{menuItem.count}</span>}
        {menuItem.icon && <span className={`${menuItem.icon} ${style.icon}`} />}
      </a>
    ),
  }
  if (menuItem.category) {
    menuObject.type = 'group'
  }
  if (menuItem.children) {
    menuObject.children = menuItem.children.map(sub => generateMenuObject(sub, role_ids))
  }
  return menuObject
}

export const useSelectorMenu = () => {
  const history = useHistory()
  const { pathname } = history.location

  const menuData = useSelector(({ auth: { menu } }) => menu.menuData)
  const selectedKeys = React.useMemo(() => {
    return menuData.find(x => x.url === pathname)?.menu_id.toString()
  }, [menuData, pathname])

  const onSelectMenu = React.useCallback(
    item => {
      // navigate like Link react-router-dom
      const { url } = menuData.find(menu => menu.menu_id === parseInt(item.key, 10))

      if (url.includes('-fly')) window.open(`/#${url}`, '_blank')
      else history.push(url)
    },
    [menuData, history],
  )

  return { selectedKeys, onSelectMenu }
}

export default generateMenuObject
