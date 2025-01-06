import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { UserOutlined } from '@ant-design/icons'
import { Dropdown, Avatar, Badge, Space } from 'antd'
import styles from './style.module.scss'
import SwitchMenu from '../SwitchMenu'
import SwitchTheme from '../SwitchTheme'
import SetPrimaryColor from '../SetPrimaryColor'
import SwitchNotif from '../SwitchNotif'

const mapStateToProps = ({ auth: { user } }) => ({ user })

const ProfileMenu = ({ dispatch, user }) => {
  const [count] = useState(0)

  const [open, setOpen] = useState(false)
  const handleMenuClick = e => {
    if (e.key === '3') {
      setOpen(false)
    }
  }
  const handleOpenChange = (nextOpen, info) => {
    if (info.source === 'trigger' || nextOpen) {
      setOpen(nextOpen)
    }
  }

  const logout = e => {
    e.preventDefault()
    dispatch({
      type: 'auth/user/LOGOUT',
      source: 'Dashboard',
    })
  }

  const mergeAvatar = avatar => {
    if (!avatar) {
      return (
        <Avatar className={styles.avatar} shape="square" size="large" icon={<UserOutlined />} />
      )
    }
    return <Avatar className={styles.avatar} shape="square" size="large" src={avatar} />
  }

  const menu = {
    selectable: false,
    items: [
      {
        key: 1,
        label: (
          <Space direction="vertical">
            <strong>
              <FormattedMessage id="topBar.profileMenu.hello" />, {user.name || 'Anonymous'}
            </strong>
            <strong>
              <FormattedMessage id="topBar.profileMenu.role" />:{' '}
              {user.roles.join(', ') || 'Anonymous'}
            </strong>
            <strong>
              <FormattedMessage id="topBar.profileMenu.email" />: {user.email || '—'}
            </strong>
          </Space>
        ),
      },
      { type: 'divider' },
      {
        key: 2,
        label: (
          <a href="#/my-profile">
            <i className="fe fe-user mr-2" />
            <FormattedMessage id="topBar.profileMenu.editProfile" />
          </a>
        ),
      },
      { type: 'divider' },
      {
        key: 3,
        type: 'group',
        label: 'Settings',
        children: [
          {
            label: (
              <div className="w-100 d-flex justify-content-between">
                Set Primary Color
                <SetPrimaryColor />
              </div>
            ),
          },
          {
            label: (
              <div className="w-100 d-flex justify-content-between">
                Theme
                <SwitchTheme />
              </div>
            ),
          },
          {
            label: (
              <div className="w-100 d-flex justify-content-between">
                Menu
                <SwitchMenu />
              </div>
            ),
          },
          {
            label: (
              <div className="w-100 d-flex justify-content-between">
                Notification
                <SwitchNotif />
              </div>
            ),
          },
        ],
      },
      { type: 'divider' },
      {
        key: 4,
        label: (
          <a href="#" onClick={logout}>
            <i className="fe fe-log-out mr-2" />
            <FormattedMessage id="topBar.profileMenu.logout" />
          </a>
        ),
      },
    ],
    onClick: handleMenuClick,
  }
  return (
    <Dropdown menu={menu} onOpenChange={handleOpenChange} open={open}>
      <div className={styles.dropdown}>
        <Badge count={count}>{mergeAvatar(user.avatar)}</Badge>
      </div>
    </Dropdown>
  )
}

export default connect(mapStateToProps)(ProfileMenu)
