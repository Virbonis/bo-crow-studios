import React from 'react'
import { Helmet } from 'react-helmet'
import { Descriptions, Tag } from 'antd'
import { connect } from 'react-redux'

const mapStateToProps = ({ auth: { user } }) => ({
  user,
})

const renderLastLogin = date => {
  if (date === null) return ''
  return date.formatDateTimeSecond()
}

const renderRoles = roles => {
  return roles.map(value => (value !== '' ? <Tag key={value}>{value}</Tag> : null))
}

const HomePage = ({ user }) => {
  return (
    <>
      <Helmet title="Home Page" />
      <div className="card">
        <div className="card-body">
          <Descriptions title="User Info">
            <Descriptions.Item span={3} label="Name">
              {user.name}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Email">
              {user.email}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Role">
              {renderRoles(user.roles)}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Last Login">
              {renderLastLogin(user.last_login)}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </>
  )
}

export default connect(mapStateToProps)(HomePage)
