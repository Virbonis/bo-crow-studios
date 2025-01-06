import { Alert, Form, Input } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/operator-list/actions'

const mapDispatchToProps = dispatch => ({
  CreateOperator: (payload, successCallback) => {
    dispatch({
      type: actions.CREATE,
      payload,
      successCallback,
      source: 'Operator List',
    })
  },
})

const CreateForm = ({ successCallback, CreateOperator, allowCreate }) => {
  const [form] = Form.useForm()

  if (!allowCreate)
    return <Alert message="You are not allowed to Create Operator!" type="error" className="mb-1" />
  return (
    <Form
      id="form-create-operator"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      form={form}
      labelAlign="left"
      onFinish={values => {
        CreateOperator(values, successCallback)
      }}
    >
      <Form.Item
        label="Branch ID"
        name="branch_id"
        rules={[{ required: true, message: 'Please input Branch ID' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Branch Name"
        name="branch_name"
        rules={[{ required: true, message: 'Please input Branch Name' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Secret Key"
        name="secret_key"
        rules={[{ required: true, message: 'Please input Secret Key' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Prefix"
        name="prefix"
        rules={[{ required: true, message: 'Please input Prefix' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Operator ID"
        name="operator_id"
        rules={[{ required: true, message: 'Please input Operator ID' }]}
      >
        <Input />
      </Form.Item>
    </Form>
  )
}

export default connect(null, mapDispatchToProps)(CreateForm)
