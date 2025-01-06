import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Input, Form } from 'antd'
import actions from 'redux/admin/role/actions'

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

const EditForm = ({ Update, editValue, successCallback }) => {
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

export default connect(null, mapDispatchToProps)(EditForm)
