import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { Form, Input } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/customer-list/actions'

const mapDispatchToProps = dispatch => ({
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_RESET_PASSWORD_CUSTOMER,
      payload,
      successCallback,
      source: 'Customer List',
    })
  },
})

const ResetPassword = ({ editValue, Update, successCallback }) => {
  const [form] = Form.useForm()

  return (
    <Form
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      id="password-form"
      onFinish={value => {
        Update(
          {
            customer_id: editValue.customer_id,
            username: editValue.username,
            password: value.password,
          },
          successCallback,
        )
      }}
    >
      <Form.Item label="Customer ID">{editValue.customer_id}</Form.Item>
      <Form.Item label="Username">{editValue.username}</Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            validator(_, value) {
              if (value.length < 8) {
                return Promise.reject(new Error('Minimum 8 characters'))
              }
              if (!/^([a-zA-Z0-9]+)$/.test(value) || !/\d/.test(value) || !/[A-Z]/i.test(value)) {
                return Promise.reject(new Error('Alpha Numeric'))
              }
              return Promise.resolve()
            },
          },
        ]}
      >
        <Input.Password
          maxLength={12}
          iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
      </Form.Item>
      <Form.Item
        name="password_confirm"
        label="Confirm Password"
        dependencies={['password']}
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (getFieldValue('password') === value) {
                return Promise.resolve()
              }
              if (!value) {
                return Promise.reject(new Error(''))
              }
              return Promise.reject(new Error('Password & Confirm Password must be same'))
            },
          }),
        ]}
      >
        <Input.Password
          maxLength={12}
          iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
      </Form.Item>
    </Form>
  )
}

export default connect(null, mapDispatchToProps)(ResetPassword)
