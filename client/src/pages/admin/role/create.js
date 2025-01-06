import React from 'react'
import { connect } from 'react-redux'
import { Form, Input } from 'antd'
import actions from 'redux/admin/role/actions'

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
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please input name' }]}
      >
        <Input placeholder="Name" />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please input description' }]}
      >
        <Input placeholder="Description" />
      </Form.Item>
    </Form>
  )
}

export default connect(null, mapDispatchToProps)(CreateForm)
