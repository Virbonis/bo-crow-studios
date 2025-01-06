import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Form, InputNumber } from 'antd'
import actions from 'redux/profile/actions'

const mapDispatchToProps = dispatch => ({
  UpdatePayout: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_PAYOUT,
      payload,
      successCallback,
      source: 'Master Profile',
    })
  },
})

const EditPayout = ({ UpdatePayout, successCallback, editValue }) => {
  const [form] = Form.useForm()
  useEffect(() => {
    form.setFieldsValue(editValue)
  }, [form, editValue])

  /*
Max Payout |	Max Payout/Ticket |	Max Bet |	Spread |	LAP |	Amount Trigger
*/
  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      labelAlign="left"
      form={form}
      id="edit-form"
      onFinish={values => UpdatePayout({ ...editValue, ...values }, successCallback)}
      initialValues={editValue}
    >
      <Form.Item name="max_payout" label="Max Payout" rules={[{ required: true }]}>
        <InputNumber className="w-100" placeholder="Step" />
      </Form.Item>
      <Form.Item
        name="max_payout_ticket"
        label="Max Payout/Ticket"
        rules={[{ required: true, message: 'Please input Max Payout/Ticket' }]}
      >
        <InputNumber placeholder="Max Payout/Ticket" />
      </Form.Item>
      <Form.Item
        name="max_bet"
        label="Max Bet"
        rules={[{ required: true, message: 'Please input Max Bet' }]}
      >
        <InputNumber placeholder="Max Bet" />
      </Form.Item>
      {[1, 8].includes(editValue.game_type) && (
        <>
          <Form.Item
            name="spread"
            label="Spread"
            rules={[{ required: true, message: 'Please input Spread' }]}
          >
            <InputNumber className="w-100" placeholder="Spread" />
          </Form.Item>
          <Form.Item name="lap" label="LAP" rules={[{ required: true }]}>
            <InputNumber className="w-100" placeholder="LAP" />
          </Form.Item>
        </>
      )}
      <Form.Item name="amount_trigger" label="Amount Trigger" rules={[{ required: true }]}>
        <InputNumber className="w-100" placeholder="Amount Trigger" />
      </Form.Item>
    </Form>
  )
}

export default connect(null, mapDispatchToProps)(EditPayout)
