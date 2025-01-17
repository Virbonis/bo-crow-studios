import React, { Fragment } from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
// import NProgress from 'nprogress'
import { Helmet } from 'react-helmet'
// import Loader from 'components/cleanui/layout/Loader'
import PublicLayout from './Public'
import AuthLayout from './Auth'
import MainLayout from './Main'
import FlyLayout from './Fly'

const Layouts = {
  public: PublicLayout,
  auth: AuthLayout,
  main: MainLayout,
  fly: FlyLayout,
}

const mapStateToProps = ({ auth: { user } }) => ({ user })

// let previousPath = ''

const Layout = ({ user, children, location: { pathname } }) => {
  // NProgress & ScrollTop Management
  // const currentPath = pathname + search
  // if (currentPath !== previousPath) {
  //   window.scrollTo(0, 0)
  //   NProgress.start()
  // }
  // setTimeout(() => {
  //   NProgress.done()
  //   previousPath = currentPath
  // }, 300)

  // Layout Rendering
  const getLayout = () => {
    if (pathname === '/') {
      return 'public'
    }
    if (pathname.includes('-fly')) return 'fly'
    if (/^\/auth(?=\/|$)/i.test(pathname)) {
      return 'auth'
    }
    return 'main'
  }

  const Container = Layouts[getLayout()]
  const isUserAuthorized = user.authorized
  const isUserLoading = user.loading
  const isAuthLayout = getLayout() === 'auth'

  const BootstrappedLayout = () => {
    // show loader when user in check authorization process, not authorized yet and not on login pages
    if (isUserLoading && !isUserAuthorized && !isAuthLayout) {
      return null
    }
    // redirect to login page if current is not login page and user not authorized
    if (!isAuthLayout && !isUserAuthorized) {
      return <Redirect to="/auth/login" />
    }
    // in other case render previously set layout
    return <Container>{children}</Container>
  }

  return (
    <Fragment>
      <Helmet titleTemplate="%s | Crow Studios Backoffice" title="" />
      {BootstrappedLayout()}
    </Fragment>
  )
}

export default withRouter(connect(mapStateToProps)(Layout))
