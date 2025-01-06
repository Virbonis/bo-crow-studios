import React from 'react'
import { Input, Button, Form, Space } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import actions from 'redux/auth/user/actions'
import { UploadImage } from 'components/blaise'

const mapStateToProps = ({ auth: { user } }) => ({
  user,
})

const mapDispatchToProps = dispatch => ({
  submitEditUser: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
      source: 'My Profile',
    })
  },
})

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
}
const MyProfile = ({ user, submitEditUser }) => {
  const [form] = Form.useForm()

  React.useEffect(() => {
    form.setFieldsValue({
      ...user,
      avatar: [user.avatar],
    })
  }, [form, user])

  return (
    <>
      <Helmet title="My Profile" />
      <div className="card">
        <div className="card-body">
          <Form
            {...formItemLayout}
            labelAlign="left"
            onFinish={values =>
              submitEditUser({
                ...values,
                avatar: values.avatar[0],
              })
            }
            form={form}
          >
            <Form.Item label="Email">{user.email}</Form.Item>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              extra="*Leave blank if you don't want to change your password"
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item
              name="password_confirmation"
              label="Password Confirmation"
              rules={[
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (
                      getFieldValue('password') !== '' &&
                      getFieldValue('password') !== undefined &&
                      (value === '' || value === undefined)
                    ) {
                      return Promise.reject(new Error('Please input you Password Confirmation!'))
                    }
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }

                    return Promise.reject(
                      new Error('The two passwords that you entered do not match!'),
                    )
                  },
                }),
              ]}
              dependencies={['password']}
            >
              <Input.Password placeholder="Password Confirmation" />
            </Form.Item>
            <Form.Item name="avatar" label="Avatar">
              <UploadImage {...opts} />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button htmlType="button">Reset</Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
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

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile)
