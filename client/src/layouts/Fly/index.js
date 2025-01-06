import React from 'react'
import { Layout } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import classNames from 'classnames'
// import Footer from 'components/blaise/layout/Footer'

const mapStateToProps = ({ auth: { settings } }) => ({
  isContentMaxWidth: settings.isContentMaxWidth,
  isAppMaxWidth: settings.isAppMaxWidth,
  isGrayBackground: settings.isGrayBackground,
  isSquaredBorders: settings.isSquaredBorders,
  isCardShadow: settings.isCardShadow,
  isBorderless: settings.isBorderless,
  // isTopbarFixed: settings.isTopbarFixed,
  // isGrayTopbar: settings.isGrayTopbar,
})

const FlyLayout = ({
  children,
  isContentMaxWidth,
  isAppMaxWidth,
  isGrayBackground,
  isSquaredBorders,
  isCardShadow,
  isBorderless,
}) => {
  React.useEffect(() => {
    // document.addEventListener('touchstart', e => e.preventDefault(), true)
    // document.addEventListener('touchmove', e => e.preventDefault(), true)
    // document.addEventListener('touchend', e => e.preventDefault(), true)
    // document.addEventListener('touchstart', e => e.preventDefault(), { passive: false })
    // document.addEventListener('touchmove', e => e.preventDefault(), { passive: false })
    // document.addEventListener('touchend', e => e.preventDefault(), { passive: false })
  }, [])

  return (
    <div className={classNames({ cui__layout__grayBackground: isGrayBackground })}>
      <Layout
        className={classNames({
          cui__layout__contentMaxWidth: isContentMaxWidth,
          cui__layout__appMaxWidth: isAppMaxWidth,
          cui__layout__grayBackground: isGrayBackground,
          cui__layout__squaredBorders: isSquaredBorders,
          cui__layout__cardsShadow: isCardShadow,
          cui__layout__borderless: isBorderless,
        })}
      >
        <Layout>
          <Layout.Content style={{ height: '100%', position: 'relative' }}>
            {children}
          </Layout.Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default withRouter(connect(mapStateToProps)(FlyLayout))
