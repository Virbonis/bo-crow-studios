import { Card, Form, InputNumber } from 'antd'
import React, { useEffect } from 'react'

const LAPShortForm = ({ initialValue, ButtonActions, OnFinish }) => {
  const [formLapShort] = Form.useForm()

  useEffect(() => {
    formLapShort.setFieldsValue(initialValue)
  })

  return (
    <Card title="LAP Short AH/OU">
      <Form
        form={formLapShort}
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 12 }}
        onFinish={OnFinish}
      >
        <Form.Item name="total_pause_today" label="Today" style={{ marginBottom: '0px' }}>
          <InputNumber min={0} className="w-100" type="number" placeholder="AH" />
        </Form.Item>
        <Form.Item name="total_pause_early" label="Early" style={{ marginBottom: '0px' }}>
          <InputNumber min={0} className="w-100" type="number" placeholder="AH" />
        </Form.Item>
        <Form.Item name="total_pause_live" label="Live OS" style={{ marginBottom: '0px' }}>
          <InputNumber min={0} className="w-100" type="number" placeholder="AH" />
        </Form.Item>
        <ButtonActions />
      </Form>
    </Card>
  )
}

export default LAPShortForm
