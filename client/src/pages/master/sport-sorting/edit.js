import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Form, InputNumber } from 'antd'
import actions from 'redux/sport/actions'

const mapDispatchToProps = dispatch => ({
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_SORTING,
      payload,
      successCallback,
      source: 'Master Sport Sorting Update',
    })
  },
})

const EditMasterSportSorting = ({ Update, successCallback, editValue }) => {
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
      <Form.Item label="Sport ID">{editValue.sport_id}</Form.Item>
      <Form.Item label="Sport Name">{editValue.sport_name}</Form.Item>
      <Form.Item
        name="no_display"
        label="No Display"
        rules={[{ required: true, message: 'Please input No Display' }]}
      >
        <InputNumber className="w-100" placeholder="No Display" />
      </Form.Item>
    </Form>
  )
}

export default connect(null, mapDispatchToProps)(EditMasterSportSorting)
