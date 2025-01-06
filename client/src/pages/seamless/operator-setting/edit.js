import { Form, Input, InputNumber, Switch } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/operator-setting/actions'

const mapDispatchToProps = dispatch => ({
  UpdateSetting: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
      souce: 'Operator Setting',
    })
  },
})

const EditSetting = ({ data, successCallback, UpdateSetting }) => {
  const [form] = Form.useForm()
  return (
    <Form
      id="form-setting"
      form={form}
      initialValues={data}
      labelAlign="left"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={values => {
        UpdateSetting(values, successCallback)
      }}
    >
      <Form.Item label="Branch ID" name="branch_id">
        {data.branch_id}
      </Form.Item>
      <Form.Item label="Branch Name" name="branch_name">
        {data.branch_name}
      </Form.Item>
      <Form.Item label="Prefix" name="prefix">
        {data.prefix}
      </Form.Item>
      <Form.Item label="Operator ID" name="operator_id">
        {data.operator_id}
      </Form.Item>
      <Form.Item label="Odds Type" name="odds_type">
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item
        label="Default Language"
        name="default_language"
        rules={[{ required: true, message: 'Please input Default Language' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Supported Language"
        name="supported_language"
        rules={[{ required: true, message: 'Please input Supported Language' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Portal URL"
        name="portal_url"
        rules={[{ required: true, message: 'Please input Portal URL' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Is Sub Domain" name="is_sub_domain" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  )
}

export default connect(null, mapDispatchToProps)(EditSetting)
