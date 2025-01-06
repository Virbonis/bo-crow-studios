import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, InputNumber, Switch } from 'antd'
import actions from 'redux/admin/permission/actions'

const mapDispatchToProps = dispatch => ({
  Create: (payload, successCallback) =>
    dispatch({
      type: actions.CREATE,
      payload,
      successCallback,
      source: '',
    }),
})

const CreateForm = ({ Create, successCallback }) => {
  const [form] = Form.useForm()

  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      labelAlign="left"
      form={form}
      id="create-form"
      onFinish={values => {
        Create(values, () => {
          successCallback()
          form.resetFields()
        })
      }}
    >
      <Form.Item
        name="group"
        label="Group"
        rules={[{ required: true, message: 'Please input Group!' }]}
      >
        <Input placeholder="Group" />
      </Form.Item>
      <Form.Item name="seq_no" label="Seq No">
        <InputNumber placeholder="Seq No" className="w-100" />
      </Form.Item>
      <Form.Item
        name="code"
        label="Code"
        rules={[{ required: true, message: 'Please input Code!' }]}
      >
        <Input placeholder="Code" />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please input Description!' }]}
      >
        <Input placeholder="Description" />
      </Form.Item>
      <Form.Item name="is_for_admin" label="Is For Admin" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item name="is_for_operator" label="Is For Operator" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  )
}

export default connect(null, mapDispatchToProps)(CreateForm)
