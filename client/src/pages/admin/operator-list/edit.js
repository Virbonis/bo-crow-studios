import React from 'react'
import { connect } from 'react-redux'
import { Form, Input } from 'antd'
import actions from 'redux/operator-list/actions'

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  Update: payload => {
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
    })
  },
})

const EditForm = ({ Update, editValue }) => {
  if (!editValue) return null

  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      labelAlign="left"
      id="form-edit-operator"
      initialValues={editValue}
      onFinish={values =>
        Update({
          ...editValue,
          ...values,
        })
      }
    >
      <Form.Item label="Operator ID" className="mb-0">
        {editValue.operator_id}
      </Form.Item>
      <Form.Item
        className="mb-0"
        name="validate_url"
        label="Validate URL"
        rules={[{ required: true, message: 'Please input Validate URL!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        className="mb-0"
        name="secret_key"
        label="Secret Key"
        rules={[{ required: true, message: 'Please input Secret Key!' }]}
      >
        <Input />
      </Form.Item>
    </Form>
  )
}

export default connect(null, mapDispatchToProps)(EditForm)
