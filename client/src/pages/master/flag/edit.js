import { Form, Input } from 'antd'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import actions from 'redux/flag/actions'
import CustomUploadBase64 from './upload-image'

const mapDispatchToProps = dispatch => ({
  UpdateFlag: (payload, successCallback) => {
    dispatch({
      type: actions.CHANGE_FLAG,
      payload,
      successCallback,
      source: 'Flag',
    })
  },
})

const Edit = ({ UpdateFlag, successCallback, rowData }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({
      flag_name: rowData.flag_name,
      flag_file: [rowData.flag_source],
    })
  }, [form, rowData])

  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      labelAlign="left"
      form={form}
      id="form-edit"
      onFinish={values => {
        if (values.flag_file) {
          UpdateFlag(
            {
              ...values,
              flag_id: rowData.flag_id,
              flag_source: values.flag_file[0],
            },
            successCallback,
          )
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
        <Input style={{ width: '100px' }} />
      </Form.Item>
      <Form.Item
        name="flag_file"
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

export default connect(null, mapDispatchToProps)(Edit)
