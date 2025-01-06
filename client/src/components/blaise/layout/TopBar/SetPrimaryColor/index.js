import React from 'react'
import { connect } from 'react-redux'
import { generate, presetPalettes, red, green, blue } from '@ant-design/colors'
import { ColorPicker, theme } from 'antd'

const mapStateToProps = ({ auth: { settings } }) => ({
  primaryColor: settings.primaryColor,
})

const mapDispatchToProps = dispatch => ({
  setPrimaryColor: color => {
    dispatch({
      type: 'auth/settings/SET_PRIMARY_COLOR',
      payload: {
        color,
      },
    })
  },
})

const genPresets = (presets = presetPalettes) =>
  Object.entries(presets).map(([label, colors]) => ({
    label,
    colors,
  }))

const SetPrimaryColor = ({ primaryColor, setPrimaryColor }) => {
  const { token } = theme.useToken()
  const presets = genPresets({
    primary: generate(token.colorPrimary),
    red,
    green,
    blue,
  })

  return (
    <ColorPicker
      presets={presets}
      value={primaryColor}
      onChangeComplete={color => setPrimaryColor(color.toHexString())}
    />
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(SetPrimaryColor)
