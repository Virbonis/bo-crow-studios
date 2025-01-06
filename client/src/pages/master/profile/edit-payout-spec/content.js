import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Form, InputNumber } from 'antd'
import actions from 'redux/profile/actions'

const mapDispatchToProps = dispatch => ({
  UpdatePayoutSpec: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_PAYOUT_SPEC,
      payload,
      successCallback,
      source: 'Master Profile',
    })
  },
})

const EditPayoutSpec = ({ UpdatePayoutSpec, successCallback, editValue }) => {
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
      onFinish={values => UpdatePayoutSpec({ ...editValue, ...values }, successCallback)}
      initialValues={editValue}
    >
      <Form.Item
        name="max_payout_spec"
        label="Max Payout"
        rules={[{ required: true, message: 'Please input Max Payout' }]}
      >
        <InputNumber className="w-100" placeholder="Max Payout" />
      </Form.Item>
      <Form.Item
        name="max_payout_spec_ticket"
        label="Max Payout/Ticket"
        rules={[{ required: true, message: 'Please input Max Payout/Ticket' }]}
      >
        <InputNumber className="w-100" placeholder="Max Payout/Ticket" />
      </Form.Item>
      <Form.Item
        name="max_bet_spec"
        label="Max Bet"
        rules={[{ required: true, message: 'Please input Max Bet' }]}
      >
        <InputNumber className="w-100" placeholder="Max Bet" />
      </Form.Item>
      <Form.Item
        name="amount_trigger_spec"
        label="Amount Trigger"
        rules={[{ required: true, message: 'Please input Amount Trigger' }]}
      >
        <InputNumber className="w-100" placeholder="Amount Trigger" />
      </Form.Item>
    </Form>
  )
}
export default connect(null, mapDispatchToProps)(EditPayoutSpec)
