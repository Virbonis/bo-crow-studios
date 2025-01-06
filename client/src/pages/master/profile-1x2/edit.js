import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Form, InputNumber } from 'antd'
import actions from 'redux/profile-1x2/actions'

const mapDispatchToProps = dispatch => ({
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
      source: 'Master Profile1X2',
    })
  },
})

const EditProfile1X2 = ({ Update, successCallback, editValue }) => {
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
      <Form.Item
        name="odds_fav"
        label="Odds Fav"
        rules={[{ required: true, message: 'Please input Odds Fav' }]}
      >
        <InputNumber type="number" className="w-100" placeholder="Odds Fav" />
      </Form.Item>
      <Form.Item
        name="odds_draw"
        label="Odds Draw"
        rules={[{ required: true, message: 'Please input Odds Draw' }]}
      >
        <InputNumber type="number" className="w-100" placeholder="Odds Draw" />
      </Form.Item>
      <Form.Item
        name="odds_5"
        label="Odds 5"
        rules={[{ required: true, message: 'Please input Odds 5' }]}
      >
        <InputNumber type="number" className="w-100" placeholder="Odds 5" />
      </Form.Item>
      <Form.Item
        name="odds_6"
        label="Odds 6"
        rules={[{ required: true, message: 'Please input Odds 6' }]}
      >
        <InputNumber type="number" className="w-100" placeholder="Odds 6" />
      </Form.Item>
      <Form.Item
        name="odds_7"
        label="Odds 7"
        rules={[{ required: true, message: 'Please input Odds 7' }]}
      >
        <InputNumber type="number" className="w-100" placeholder="Odds 7" />
      </Form.Item>
      <Form.Item
        name="odds_8"
        label="Odds 8"
        rules={[{ required: true, message: 'Please input Odds 8' }]}
      >
        <InputNumber type="" className="w-100" placeholder="Odds 8" />
      </Form.Item>
      <Form.Item
        name="odds_9"
        label="Odds 9"
        rules={[{ required: true, message: 'Please input Odds 9' }]}
      >
        <InputNumber type="number" className="w-100" placeholder="Odds 9" />
      </Form.Item>
      <Form.Item
        name="odds_10"
        label="Odds 10"
        rules={[{ required: true, message: 'Please input Odds 10' }]}
      >
        <InputNumber type="number" className="w-100" placeholder="Odds 10" />
      </Form.Item>
      <Form.Item
        name="odds_12"
        label="Odds 12"
        rules={[{ required: true, message: 'Please input Odds 12' }]}
      >
        <InputNumber type="number" className="w-100" placeholder="Odds 12" />
      </Form.Item>
      <Form.Item
        name="odds_15"
        label="Odds 15"
        rules={[{ required: true, message: 'Please input Odds 15' }]}
      >
        <InputNumber type="number" className="w-100" placeholder="Odds 15" />
      </Form.Item>
      <Form.Item
        name="odds_18"
        label="Odds 18"
        rules={[{ required: true, message: 'Please input Odds 18' }]}
      >
        <InputNumber type="number" className="w-100" placeholder="Odds 18" />
      </Form.Item>
      <Form.Item
        name="odds_20"
        label="Odds 20"
        rules={[{ required: true, message: 'Please input Odds 20' }]}
      >
        <InputNumber type="number" className="w-100" placeholder="Odds 20" />
      </Form.Item>
      <Form.Item
        name="odds_24"
        label="Odds 24"
        rules={[{ required: true, message: 'Please input Odds 24' }]}
      >
        <InputNumber type="number" className="w-100" placeholder="Odds 24" />
      </Form.Item>
    </Form>
  )
}

export default connect(null, mapDispatchToProps)(EditProfile1X2)
