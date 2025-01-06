import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Form, InputNumber } from 'antd'
import actions from 'redux/cash-category/actions'

const mapDispatchToProps = dispatch => ({
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
      source: 'Master Cash Category',
    })
  },
})

const EditCashCategory = ({ editValue, successCallback, Update }) => {
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
      <Form.Item label="Cash Category ID">{editValue.cash_category_id}</Form.Item>
      <Form.Item
        name="position_taking"
        label="Position Taking"
        rules={[{ required: true, message: 'Please input Position Taking' }]}
      >
        <InputNumber className="w-100" placeholder="Position Taking" />
      </Form.Item>
    </Form>
  )
}

export default connect(null, mapDispatchToProps)(EditCashCategory)
