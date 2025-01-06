import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Form, InputNumber } from 'antd'
import actions from 'redux/profile/actions'

const mapDispatchToProps = dispatch => ({
  UpdateEventLimit: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
      source: 'Master Profile',
    })
  },
})

const Content = ({ UpdateEventLimit, successCallback, editValue }) => {
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
      onFinish={values => {
        UpdateEventLimit({ ...editValue, ...values }, successCallback)
      }}
      initialValues={editValue}
    >
      <Form.Item
        name="step"
        label="Step"
        rules={[{ required: true, type: 'number', min: 0, max: 99 }]}
      >
        <InputNumber className="w-100" placeholder="Step" />
      </Form.Item>
      <Form.Item
        name="odds_trigger"
        label="Odds Trigger"
        rules={[{ required: true, message: 'Please input Odds Trigger' }]}
      >
        <InputNumber className="w-100" placeholder="Odds Trigger" />
      </Form.Item>
      <Form.Item
        name="max_limit"
        label="Max Limit"
        rules={[{ required: true, message: 'Please input Max Limit' }]}
      >
        <InputNumber className="w-100" placeholder="Max Limit" />
      </Form.Item>
      <Form.Item
        name="max_bet"
        label="Max Bet"
        rules={[{ required: true, message: 'Please input Max Bet' }]}
      >
        <InputNumber className="w-100" placeholder="Max Bet" />
      </Form.Item>
      <Form.Item
        name="spread"
        label="Spread"
        rules={[{ required: true, message: 'Please input Spread' }]}
      >
        <InputNumber
          className="w-100"
          placeholder="Spread"
          min={3}
          max={50}
          disabled={editValue.game_type_sequence !== 1}
        />
      </Form.Item>
    </Form>
  )
}

export default connect(null, mapDispatchToProps)(Content)
