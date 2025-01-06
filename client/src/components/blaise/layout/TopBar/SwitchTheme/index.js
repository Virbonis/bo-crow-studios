import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = ({ auth: { settings } }) => ({
  theme: settings.theme,
})

const mapDispatchToProps = dispatch => ({
  setTheme: nextTheme => {
    dispatch({
      type: 'auth/settings/SET_THEME',
      payload: {
        theme: nextTheme,
      },
    })
    dispatch({
      type: 'auth/settings/CHANGE_SETTING',
      payload: {
        setting: 'menuColor',
        value: nextTheme === 'dark' ? 'dark' : 'light',
      },
    })
  },
})

const SwitchTheme = ({ theme, setTheme }) => {
  return (
    <a
      role="button"
      tabIndex="0"
      onFocus={e => {
        e.preventDefault()
      }}
      onKeyPress={() => setTheme(theme === 'default' ? 'dark' : 'default')}
      onClick={() => setTheme(theme === 'default' ? 'dark' : 'default')}
    >
      {theme === 'default' && <i className="fe fe-moon" />}
      {theme !== 'default' && <i className="fe fe-sun" />}
    </a>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(SwitchTheme)
