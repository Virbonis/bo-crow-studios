import React from 'react'
import { Helmet } from 'react-helmet'
import Login from 'components/blaise/system/Auth/Login'

const SystemLogin = () => {
  return (
    <div>
      <Helmet title="Login" />
      <Login />
    </div>
  )
}

export default SystemLogin
