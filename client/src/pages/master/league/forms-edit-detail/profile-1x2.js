import { Card, Form, Select } from 'antd'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import React, { useEffect } from 'react'

const Profile1X2Form = ({ initialValue, ButtonActions, OnFinish }) => {
  const [formProfile1X2] = Form.useForm()
  const { profile1x2Options } = useSelectOptions()

  useEffect(() => {
    formProfile1X2.setFieldsValue(initialValue)
  })

  return (
    <Card title="Profile 1X2" style={{ marginTop: '8px' }}>
      <Form
        form={formProfile1X2}
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 12 }}
        onFinish={OnFinish}
      >
        <Form.Item name="limit_id1x2" label="Profile 1x2">
          <Select options={profile1x2Options} showSearch />
        </Form.Item>
        <ButtonActions />
      </Form>
    </Card>
  )
}

export default Profile1X2Form
