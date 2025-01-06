import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, InputNumber } from 'antd'
import actions from 'redux/operator-seamless/actions'

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  CreateConfig: payload => {
    dispatch({
      type: actions.CREATE_CONFIG,
      payload,
      successCallback,
    })
  },
})

const CreateConfigForm = ({ CreateConfig, operator_id }) => {
  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      labelAlign="left"
      id="create-config-form"
      onFinish={values =>
        CreateConfig({
          operator_id,
          ...values,
        })
      }
    >
      <Form.Item label="Operator ID" className="mb-0">
        {operator_id}
      </Form.Item>
      <Form.Item
        className="mb-0"
        name="config_key"
        label="Config Key"
        rules={[{ required: true, message: 'Please input config key!' }]}
      >
        <Input />
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
        <InputNumber defaultValue={5} />
      </Form.Item>
      <Form.Item
        className="mb-0"
        name="request_timeout"
        label="Request Timeout"
        rules={[{ required: true, message: 'Please input request timeout' }]}
      >
        <InputNumber defaultValue={10} />
      </Form.Item>
    </Form>
  )
}

export default connect(null, mapDispatchToProps)(CreateConfigForm)
