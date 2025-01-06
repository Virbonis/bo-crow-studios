import React from 'react'
import { connect } from 'react-redux'
import { Switch } from 'antd'
import actions from 'redux/mo5/actions'
import { ExclamationOutlined, StopOutlined } from '@ant-design/icons'

const mapStateToProps = ({ mo5 }) => ({
  disable_notification: mo5.disable_notification,
})
const mapDispatchToProps = dispatch => ({
  UpdateSuppressor: payload => dispatch({ type: actions.SET_NOTIFICATION, payload }),
})
const NotificationSuppressorMO = ({ disable_notification, UpdateSuppressor }) => {
  return (
    <span>
      Suppress{' '}
      <Switch
        className={disable_notification ? 'bg-red' : 'bg-green'}
        size="default"
        checked={disable_notification}
        onChange={() => {
          UpdateSuppressor(!disable_notification)
        }}
        checkedChildren={<StopOutlined />}
        unCheckedChildren={<ExclamationOutlined />}
      />
    </span>
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(NotificationSuppressorMO)
