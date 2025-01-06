import React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { routes } from 'router'

const mapStateToProps = ({ auth: { menu } }) => ({
  menuData: menu.menuData,
})
// used in route/tabs content
const LayoutHelmet = ({ menuData, location: { pathname } }) => {
  const menuItem = menuData.find(e => e.url === pathname)
  const routeItem = routes.find(e => e.path === pathname)

  return <Helmet title={menuItem?.title || routeItem?.title} />
}

export default withRouter(connect(mapStateToProps, null)(LayoutHelmet))
