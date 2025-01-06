import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Switch } from 'antd'
import actions from 'redux/admin/user/actions'

const mapDispatchToProps = dispatch => ({
  Create: (payload, successCallback) =>
    dispatch({
      type: actions.CREATE,
      payload,
      successCallback,
      source: '',
    }),
})

const CreateForm = ({ Create, successCallback }) => {
  const [form] = Form.useForm()

  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      labelAlign="left"
      form={form}
      id="create-form"
      onFinish={values => {
        Create(values, () => {
          successCallback()
          form.resetFields()
        })
      }}
    >
      <Form.Item
        name="username"
        label="Username"
        rules={[{ required: true, message: 'Please input username!' }]}
      >
        <Input placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please input name!' }]}
      >
        <Input placeholder="Name" />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, message: 'Please input email!' }]}
      >
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item name="is_active" label="Is Active" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item name="is_sys_admin" label="Is Sys Admin" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item name="is_lob" label="Is LOB" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  )
}

export default connect(null, mapDispatchToProps)(CreateForm)
