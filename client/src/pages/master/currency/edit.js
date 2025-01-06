import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Form, Input, DatePicker, InputNumber } from 'antd'
import actions from 'redux/currency/actions'
import dayjs from 'dayjs'

const mapDispatchToProps = dispatch => ({
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
      source: 'Master Currency',
    })
  },
})

const EditCurrency = ({ editValue, successCallback, Update }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({
      ...editValue,
      effective_date: dayjs(editValue.effective_date),
    })
  }, [form, editValue])

  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      labelAlign="left"
      form={form}
      id="edit-form"
      onFinish={values => Update({ ...editValue, ...values }, successCallback)}
      initialValues={{
        ...editValue,
        effective_date: dayjs(editValue.effective_date),
      }}
    >
      <Form.Item label="Currency">{editValue.currency}</Form.Item>
      <Form.Item
        name="description"
        label="Currency Name"
        rules={[{ required: true, message: 'Please input Currency Name' }]}
      >
        <Input type="text" className="w-100" placeholder="Currency Name" />
      </Form.Item>
      <Form.Item
        name="currency_rate"
        label="Rate"
        rules={[
          { required: true, message: 'Please input Currency Rate' },
          { min: 1, type: 'number', message: 'Minimum rate is 1' },
        ]}
      >
        <InputNumber className="w-100" placeholder="Rate" />
      </Form.Item>
      <Form.Item
        name="effective_date"
        label="Effective Date"
        rules={[{ required: true, message: 'Please input Efective Date' }]}
      >
        <DatePicker className="w-100" format="YYYY-MM-DD" />
      </Form.Item>
    </Form>
  )
}

export default connect(null, mapDispatchToProps)(EditCurrency)
