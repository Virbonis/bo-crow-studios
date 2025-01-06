import React from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import style from './MenuLeft/style.module.scss'

export const generateMenuObject = menuItem => {
  const transformedData = menuItem.reduce((acc, curr) => {
    if (!curr.parent) {
      acc.push({
        title: curr.title,
        key: curr.menu_id,
        label: (
          <a>
            <span className={style.title}>{curr.title}</span>
            {curr.icon && <span className={`${curr.icon} ${style.icon}`} />}
          </a>
        ),
        children: [],
      })
    } else {
      const parent = acc.find(e => e.title === curr.parent)
      if (parent) {
        parent.children.push({
          ...curr,
          key: curr.menu_id,
          label: (
            <a>
              <span className={style.title}>{curr.title}</span>
            </a>
          ),
        })
      }
    }
    return acc
  }, [])

  return transformedData
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
