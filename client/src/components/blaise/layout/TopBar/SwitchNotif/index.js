import { Switch } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/auth/setting/actions'

const mapStateToProps = ({ auth: { settings } }) => ({
  notifState: settings.notification,
})
const mapDispatchToProps = dispatch => ({
  ChangeNotificationSetting: payload =>
    dispatch({
      type: actions.CHANGE_SETTING,
      payload: {
        setting: 'notification',
        value: payload,
      },
    }),
})

const SwitchNotif = ({ ChangeNotificationSetting, notifState }) => {
  return <Switch onChange={ChangeNotificationSetting} value={notifState} />
}

export default connect(mapStateToProps, mapDispatchToProps)(SwitchNotif)
