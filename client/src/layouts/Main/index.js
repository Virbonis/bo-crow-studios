import React from 'react'
import { Layout } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import classNames from 'classnames'
import TopBar from 'components/blaise/layout/TopBar'
import Menu from 'components/blaise/layout/Menu'
import Footer from 'components/blaise/layout/Footer'
import LayoutTabs from 'components/blaise/layout/LayoutTabs'

const mapStateToProps = ({ auth: { settings } }) => ({
  isContentMaxWidth: settings.isContentMaxWidth,
  isAppMaxWidth: settings.isAppMaxWidth,
  isGrayBackground: settings.isGrayBackground,
  isSquaredBorders: settings.isSquaredBorders,
  isCardShadow: settings.isCardShadow,
  isBorderless: settings.isBorderless,
  isTopbarFixed: settings.isTopbarFixed,
  isGrayTopbar: settings.isGrayTopbar,
  menuLayoutType: settings.menuLayoutType,
})

const MainLayout = ({
  isContentMaxWidth,
  isAppMaxWidth,
  isGrayBackground,
  isSquaredBorders,
  isCardShadow,
  isBorderless,
  isTopbarFixed,
  isGrayTopbar,
  menuLayoutType,
}) => {
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
        {menuLayoutType === 'left' ? <Menu /> : null}
        <Layout>
          <Layout.Header
            className={classNames('cui__layout__header', {
              cui__layout__fixedHeader: isTopbarFixed,
              cui__layout__headerGray: isGrayTopbar,
            })}
          >
            {menuLayoutType === 'left' ? (
              <TopBar />
            ) : (
              <div className="d-flex justify-content-between">
                <Menu />
                <TopBar />
              </div>
            )}
          </Layout.Header>
          <Layout.Content style={{ height: '100%', width: '100%', position: 'relative' }}>
            <LayoutTabs />
          </Layout.Content>
          <Layout.Footer>
            <Footer />
          </Layout.Footer>
        </Layout>
      </Layout>
    </div>
  )
}

export default withRouter(connect(mapStateToProps)(MainLayout))
