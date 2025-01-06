import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, InputNumber } from 'antd'
import actions from 'redux/operator-seamless/actions'

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  UpdateConfig: payload => {
    dispatch({
      type: actions.UPDATE_CONFIG,
      payload,
      successCallback,
    })
  },
})

const EditConfigForm = ({ UpdateConfig, editValue }) => {
  if (!editValue) return null

  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      labelAlign="left"
      id="edit-config-form"
      initialValues={editValue}
      onFinish={values =>
        UpdateConfig({
          ...editValue,
          ...values,
        })
      }
    >
      <Form.Item label="Operator ID" className="mb-0">
        {editValue.operator_id}
      </Form.Item>
      <Form.Item label="Config Key" className="mb-0">
        {editValue.config_key}
      </Form.Item>
      <Form.Item
        className="mb-0"
        name="config_value"
        label="Config Value"
        rules={[{ required: true, message: 'Please input config value!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        className="mb-0"
        name="http_timeout"
        label="HTTP Timeout"
        rules={[{ required: true, message: 'Please input http timeout' }]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        className="mb-0"
        name="request_timeout"
        label="Request Timeout"
        rules={[{ required: true, message: 'Please input request timeout' }]}
      >
        <InputNumber />
      </Form.Item>
    </Form>
  )
}

export default connect(null, mapDispatchToProps)(EditConfigForm)
