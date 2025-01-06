import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Form, InputNumber } from 'antd'
import actions from 'redux/profile/actions'

const mapDispatchToProps = dispatch => ({
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_ODDS_TRIGGER,
      payload,
      successCallback,
      source: 'Master Profile',
    })
  },
})

const EditOddsTrigger = ({ Update, successCallback, editValue }) => {
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
      <Form.Item name="odds_from" label="Odds From" rules={[{ required: true }]}>
        <InputNumber className="w-100" placeholder="Step" disabled />
      </Form.Item>
      <Form.Item
        name="odds_to"
        label="Odds To"
        rules={[{ required: true, message: 'Please input Odds To' }]}
      >
        <InputNumber placeholder="Odds To" min={0} max={99.9} />
      </Form.Item>
      <Form.Item
        name="odds_trigger_percent"
        label="Odds Trigger"
        rules={[{ required: true, message: 'Please input Odds Trigger Percent' }]}
      >
        <InputNumber placeholder="Odds Trigger Percent" min={0} max={99.9} />
      </Form.Item>
    </Form>
  )
}

export default connect(null, mapDispatchToProps)(EditOddsTrigger)
