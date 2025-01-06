import { Card, Form, Select } from 'antd'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import React, { useEffect } from 'react'

const RegionForm = ({ initialValue, ButtonActions, OnFinish }) => {
  const [formRegion] = Form.useForm()
  const { regionOptions } = useSelectOptions()

  useEffect(() => {
    formRegion.setFieldsValue(initialValue)
  })

  return (
    <Card title="Region" style={{ marginTop: '8px' }}>
      <Form form={formRegion} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} onFinish={OnFinish}>
        <Form.Item name="region_id" label="Region">
          <Select options={regionOptions} showSearch />
        </Form.Item>
        <ButtonActions />
      </Form>
    </Card>
  )
}

export default RegionForm
