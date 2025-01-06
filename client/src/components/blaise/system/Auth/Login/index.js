import React from 'react'
import { connect } from 'react-redux'
import { Input, Button, Form, notification } from 'antd'
import style from '../style.module.scss'

const mapStateToProps = ({ auth: { user }, dispatch }) => ({
  dispatch,
  user,
})

const Login = ({ dispatch, user }) => {
  const onFinish = values => {
    dispatch({
      type: 'auth/user/LOGIN',
      payload: values,
      source: 'Login',
    })
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const onForgotPassword = e => {
    e.preventDefault()
    notification.warning({
      message: 'Please contact your supervisor !',
    })
  }

  return (
    <div>
      <div className="text-center mb-5">&nbsp;</div>
      <div className={`card ${style.container}`}>
        <div className="text-dark font-size-24 mb-3">
          <strong>Sign in to your account</strong>
        </div>
        <Form
          layout="vertical"
          hideRequiredMark
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="mb-4"
          initialValues={{ email: '', password: '' }}
        >
          <Form.Item
            className="mb-3"
            name="username"
            rules={[{ required: true, message: 'Please input your username address' }]}
          >
            <Input style={{ padding: '3.4px 11px', fontSize: '14px' }} placeholder="Username" />
          </Form.Item>
          <Form.Item
            className="mb-3"
            name="password"
            rules={[{ required: true, message: 'Please input your password' }]}
          >
            <Input
              style={{ padding: '3.4px 11px', fontSize: '14px' }}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Button
            style={{
              height: '32px',
              padding: '3.3px 11px',
              fontSize: '14px',
              borderRadius: '2px',
            }}
            type="primary"
            className="text-center w-100"
            htmlType="submit"
            loading={user.loading}
          >
            <strong>Sign in</strong>
          </Button>
        </Form>
        <a href="#" onClick={onForgotPassword} className="kit__utils__link font-size-16">
          Forgot Password?
        </a>
      </div>
      <div className="text-center pt-2 mb-auto">&nbsp;</div>
    </div>
  )
}

export default connect(mapStateToProps)(Login)
