import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Input, Form, Switch } from 'antd'
import actions from 'redux/admin/user/actions'

const mapDispatchToProps = dispatch => ({
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
      source: '',
    })
  },
})

const EditForm = ({ Update, successCallback, editValue }) => {
  const [form] = Form.useForm()
  useEffect(() => {
    form.setFieldsValue(editValue)
  }, [form, editValue])

  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      labelAlign="left"
      form={form}
      id="edit-form"
      onFinish={values => Update({ ...editValue, ...values }, successCallback)}
      initialValues={editValue}
    >
      <Form.Item label="Username">{editValue.username}</Form.Item>
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

export default connect(null, mapDispatchToProps)(EditForm)
