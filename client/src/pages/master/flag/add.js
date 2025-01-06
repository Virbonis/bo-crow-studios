import { Form, Input } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/flag/actions'
import CustomUploadBase64 from './upload-image'

const mapDispatchToProps = dispatch => ({
  AddFlag: (payload, successCallback) => {
    dispatch({
      type: actions.ADD_FLAG,
      payload,
      successCallback,
      source: 'Flag',
    })
  },
})

const Add = ({ AddFlag, successCallback }) => {
  const [form] = Form.useForm()
  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      labelAlign="left"
      form={form}
      id="form-add"
      onFinish={values => {
        if (values.flag_source.length > 0) {
          const payload = {
            flag_name: values.flag_name,
            flag_source: values.flag_source[0],
          }

          AddFlag(payload, successCallback)
        }
      }}
    >
      <Form.Item
        name="flag_name"
        label="Flag Name"
        rules={[
          {
            required: true,
            message: 'Please Input Flag Name',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="flag_source"
        label="Flag Source"
        rules={[
          {
            required: true,
            message: 'Please Input Flag Source',
          },
        ]}
      >
        <CustomUploadBase64 {...opts} />
      </Form.Item>
    </Form>
  )
}

const opts = {
  action: '',
  accept: '.jpg, .png, .jpeg, .gif',
  beforeUpload: () => {
    return false
  },
  multiple: false,
  listType: 'picture-card',
  showUploadList: { showPreviewIcon: false },
  maxCount: 1,
}

export default connect(null, mapDispatchToProps)(Add)
