import { Input, Menu, Popover } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { debounce } from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { useSelectorMenu } from '../../Menu/helper'
import style from '../../Menu/MenuLeft/style.module.scss'

const mapStateToProps = ({ auth: { menu } }) => ({
  menuData: menu.menuData,
})

const SearchMenu = ({ menuData = [] }) => {
  const [searchValue, setSearchValue] = React.useState('')
  const [popoverOpen, setPopoverOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const debouncedSearch = React.useCallback(
    debounce(e => {
      const keyword = e.target.value
      setSearchValue(keyword)
      setPopoverOpen(keyword.length > 0)
      setLoading(false)
    }, 300),
    [],
  )
  const onChangeSearch = React.useCallback(
    e => {
      setLoading(true)
      debouncedSearch(e)
    },
    [debouncedSearch],
  )
  const menuRef = React.useRef(null)
  const menuItems = React.useMemo(() => {
    return menuData
      .filter(e => e.url)
      .map(e => ({
        ...e,
        key: e.menu_id,
        label: (
          <a>
            <span className={style.title}>{e.title}</span>
          </a>
        ),
      }))
  }, [menuData])
  const filteredMenuItems = React.useMemo(() => {
    if (searchValue.length === 0) return []
    return menuItems.filter(menuItem =>
      menuItem.title.toLowerCase().includes(searchValue.toLowerCase()),
    )
  }, [menuItems, searchValue])

  const { onSelectMenu } = useSelectorMenu()

  const content =
    filteredMenuItems.length === 0 ? (
      <div>Not Found</div>
    ) : (
      <Menu
        ref={menuRef}
        inlineIndent={0}
        mode="inline"
        items={filteredMenuItems}
        selectedKeys={[]}
        onSelect={onSelectMenu}
      />
    )
  return (
    <Popover
      fresh
      overlayInnerStyle={{
        display: searchValue || loading ? 'block' : 'none',
        width: 250,
        maxHeight: 500,
        overflow: 'auto',
      }}
      placement="bottomLeft"
      content={loading ? <div>Loading...</div> : content}
      open={popoverOpen}
      onOpenChange={setPopoverOpen}
    >
      <Input
        style={{ width: 250 }}
        prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
        variant="borderless"
        onChange={onChangeSearch}
        placeholder="Find Pages..."
        onClick={e => e.target.select()}
        onKeyDown={e => {
          // if key arrow down then focus on menu
          if (e.key === 'ArrowDown' && menuRef.current) {
            e.preventDefault()
            menuRef.current.menu.list.firstElementChild.focus()
          }
        }}
      />
    </Popover>
  )
}

export default connect(mapStateToProps)(SearchMenu)
