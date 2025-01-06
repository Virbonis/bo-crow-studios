import React from 'react'
import { connect } from 'react-redux'
import { Layout } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import classNames from 'classnames'
import style from './style.module.scss'

const mapStateToProps = ({ auth: { settings } }) => ({
  logo: settings.logo,
  isGrayTopbar: settings.isGrayTopbar,
  isCardShadow: settings.isCardShadow,
  isSquaredBorders: settings.isSquaredBorders,
  isBorderless: settings.isBorderless,
  authPagesColor: settings.authPagesColor,
})

const AuthLayout = ({
  children,
  logo,
  isGrayTopbar,
  isCardShadow,
  isSquaredBorders,
  isBorderless,
  authPagesColor,
}) => {
  return (
    <Layout>
      <Layout.Content>
        <div
          className={classNames(`${style.container}`, {
            cui__layout__squaredBorders: isSquaredBorders,
            cui__layout__cardsShadow: isCardShadow,
            cui__layout__borderless: isBorderless,
            [style.white]: authPagesColor === 'white',
            [style.gray]: authPagesColor === 'gray',
          })}
          style={{
            backgroundImage:
              authPagesColor === 'image' ? 'url(resources/images/content/photos/7.jpg)' : '',
          }}
        >
          <div
            className={classNames(`${style.topbar}`, {
              [style.topbarGray]: isGrayTopbar,
            })}
          >
            <Link to="/homepage">
              <div className={style.logoContainer}>
                <div className={style.logo}>
                  {/* <img
                    src="resources/images/logo-blaise.png"
                    className="mr-2"
                    alt="Tsubasa Admin"
                    style={{ maxWidth: '30px' }}
                  /> */}
                  <div className={style.name} style={{ maxWidth: '100%' }}>
                    {logo}
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <div className={style.containerInner}>{children}</div>
          <div className="mt-auto pb-5 pt-5">
            <div className="text-center">Copyright © 2021 Opus Gaming</div>
          </div>
        </div>
      </Layout.Content>
    </Layout>
  )
}

export default withRouter(connect(mapStateToProps)(AuthLayout))
