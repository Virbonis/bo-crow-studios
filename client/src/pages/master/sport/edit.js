import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Form, Input } from 'antd'
import actions from 'redux/sport/actions'

const mapDispatchToProps = dispatch => ({
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
      source: 'Master Sport',
    })
  },
})

const EditMasterSport = ({ Update, successCallback, editValue }) => {
  const [form] = Form.useForm()

  useEffect(() => form.resetFields(), [form])

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
      <Form.Item name="sport_id" label="Sport ID">
        <Input type="text" className="w-100" placeholder="Sport ID" disabled />
      </Form.Item>
      <Form.Item
        name="sport_name_en"
        label="English"
        rules={[{ required: true, message: 'Please input English' }]}
      >
        <Input type="text" className="w-100" placeholder="English" />
      </Form.Item>
      <Form.Item
        name="sport_name_cn"
        label="Mandarin"
        rules={[{ required: true, message: 'Please input Mandarin' }]}
      >
        <Input type="text" className="w-100" placeholder="Mandarin" />
      </Form.Item>
      <Form.Item
        name="sport_name_th"
        label="Thailand"
        rules={[{ required: true, message: 'Please input Thailand' }]}
      >
        <Input type="text" className="w-100" placeholder="Thailand" />
      </Form.Item>
      <Form.Item
        name="sport_name_jp"
        label="Japanese"
        rules={[{ required: true, message: 'Please input Japanese' }]}
      >
        <Input type="text" className="w-100" placeholder="Japanese" />
      </Form.Item>
      <Form.Item
        name="sport_name_kr"
        label="Korean"
        rules={[{ required: true, message: 'Please input Korean' }]}
      >
        <Input type="text" className="w-100" placeholder="Korean" />
      </Form.Item>
      <Form.Item
        name="sport_name_vn"
        label="Vietnamese"
        rules={[{ required: true, message: 'Please input Vietnamese' }]}
      >
        <Input type="text" className="w-100" placeholder="Vietnamese" />
      </Form.Item>
      <Form.Item
        name="sport_name_id"
        label="Indonesia"
        rules={[{ required: true, message: 'Please input Indonesia' }]}
      >
        <Input type="text" className="w-100" placeholder="Indonesia" />
      </Form.Item>
      <Form.Item
        name="site_no_display"
        label="No Display"
        rules={[{ required: true, message: 'Please input No Display' }]}
      >
        <Input type="number" className="w-100" placeholder="No Display" />
      </Form.Item>
    </Form>
  )
}

export default connect(null, mapDispatchToProps)(EditMasterSport)
