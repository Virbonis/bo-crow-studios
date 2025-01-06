import React, { Fragment, useEffect } from 'react'
import { connect } from 'react-redux'
import { notification } from 'antd'
import { history } from 'index'

const mapStateToProps = ({ auth: { user, menu } }) => ({ user, menu })

const ACL = ({
  user,
  menu,
  redirect = false,
  defaultRedirect = '/auth/404',
  roles = [],
  children,
  bypass,
}) => {
  useEffect(() => {
    const authorized = bypass ? true : roles.some(r => user.role_ids.includes(r))
    // if user not equal needed role and if component is a page - make redirect to needed route
    if (!authorized) {
      if (menu.menuData.length !== 0) {
        notification.error({
          message: 'Unauthorized Access',
          description: <div>You have no rights to access this page.</div>,
        })
      }
      if (redirect) {
        const url = typeof redirect === 'boolean' ? defaultRedirect : redirect
        history.push(url)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu])

  const authorized = bypass ? true : roles.some(r => user.role_ids.includes(r))
  const AuthorizedChildren = () => {
    // if user not authorized return null to component
    if (!authorized) {
      return null
    }
    // if access is successful render children
    return <Fragment>{children}</Fragment>
  }

  return AuthorizedChildren()
}

export default connect(mapStateToProps)(ACL)
