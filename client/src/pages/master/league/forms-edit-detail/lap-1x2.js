import { Card, Col, Form, InputNumber, Row, Typography } from 'antd'
import React, { useEffect } from 'react'

const { Text } = Typography
const LAP1X2Form = ({ initialValue, ButtonActions, OnFinish }) => {
  const [form1X2LAP] = Form.useForm()

  useEffect(() => {
    form1X2LAP.setFieldsValue(initialValue)
  })

  return (
    <Card title="1X2 LAP">
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} form={form1X2LAP} onFinish={OnFinish}>
        <Row>
          <Col span={6} />
          <Col span={9}>
            <Text>DEAD</Text>
          </Col>
          <Col span={9}>
            <Text>LIVE</Text>
          </Col>
        </Row>

        <Form.Item label="HT" style={{ marginBottom: '0px' }}>
          <Form.Item
            name="lap1x2_ht"
            rules={[{ required: true }]}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <InputNumber min={0} className="w-100" placeholder="Dead" />
          </Form.Item>
          <Form.Item
            name="lap_live1x2_ht"
            rules={[{ required: true }]}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
          >
            <InputNumber min={0} className="w-100" placeholder="Live" />
          </Form.Item>
        </Form.Item>
        <Form.Item label="FT" style={{ marginBottom: '0px' }}>
          <Form.Item
            name="lap1x2_ft"
            rules={[{ required: true }]}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <InputNumber min={0} className="w-100" placeholder="Dead" />
          </Form.Item>
          <Form.Item
            name="lap_live1x2_ft"
            rules={[{ required: true }]}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
          >
            <InputNumber min={0} className="w-100" placeholder="Live" />
          </Form.Item>
        </Form.Item>
        <ButtonActions />
      </Form>
    </Card>
  )
}

export default LAP1X2Form
