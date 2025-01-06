import { Radio } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/auth/setting/actions'

const mapStateToProps = ({ auth: { settings } }) => ({
  menuLayoutType: settings.menuLayoutType,
})
const mapDispatchToProps = dispatch => ({
  ChangeMenuPosition: payload =>
    dispatch({
      type: actions.CHANGE_SETTING,
      payload: {
        setting: 'menuLayoutType',
        value: payload,
      },
    }),
})

const SwitchMenu = ({ menuLayoutType, ChangeMenuPosition }) => {
  const onChange = e => ChangeMenuPosition(e.target.value)
  return (
    <Radio.Group
      optionType="button"
      buttonStyle="solid"
      options={[
        { label: 'Left', value: 'left' },
        { label: 'Top', value: 'top' },
      ]}
      value={menuLayoutType}
      onChange={onChange}
    />
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(SwitchMenu)
