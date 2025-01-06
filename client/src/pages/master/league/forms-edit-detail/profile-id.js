import { Card, Form, Select } from 'antd'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import React, { useEffect } from 'react'

const ProfileForm = ({ initialValue, ButtonActions, OnFinish }) => {
  const [formProfile] = Form.useForm()

  const { profileOptions } = useSelectOptions()

  useEffect(() => {
    formProfile.setFieldsValue(initialValue)
  })

  return (
    <Card title="Profile ID">
      <Form
        form={formProfile}
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 12 }}
        onFinish={OnFinish}
      >
        <Form.Item name="limit_id" label="Profile ID">
          <Select options={profileOptions} showSearch />
        </Form.Item>
        <ButtonActions />
      </Form>
    </Card>
  )
}

export default ProfileForm
