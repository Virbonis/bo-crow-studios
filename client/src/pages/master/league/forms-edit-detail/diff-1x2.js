import { Card, Col, Form, InputNumber, Row, Typography } from 'antd'
import React, { useEffect } from 'react'

const { Text } = Typography

const LDiff1X2Form = ({ initialValue, ButtonActions, OnFinish }) => {
  const [form1x2diff] = Form.useForm()

  useEffect(() => {
    form1x2diff.setFieldsValue(initialValue)
  })

  return (
    <Card title="1x2 L.Diff">
      <Form form={form1x2diff} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={OnFinish}>
        <Row>
          <Col span={6} />
          <Col span={9}>
            <Text>HT</Text>
          </Col>
          <Col span={9}>
            <Text>FT</Text>
          </Col>
        </Row>
        <Form.Item label="Home" style={{ marginBottom: '0px' }}>
          <Form.Item
            name="odds_1_diff_ht"
            rules={[{ required: true }]}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <InputNumber className="w-100" placeholder="Dead" />
          </Form.Item>
          <Form.Item
            name="odds_1_diff"
            rules={[{ required: true }]}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
          >
            <InputNumber className="w-100" placeholder="Live" />
          </Form.Item>
        </Form.Item>
        <Form.Item label="Draw" style={{ marginBottom: '0px' }}>
          <Form.Item
            name="odds_2_diff_ht"
            rules={[{ required: true }]}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <InputNumber className="w-100" placeholder="Dead" />
          </Form.Item>
          <Form.Item
            name="odds_2_diff"
            rules={[{ required: true }]}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
          >
            <InputNumber className="w-100" placeholder="Live" />
          </Form.Item>
        </Form.Item>
        <Form.Item label="Away" style={{ marginBottom: '0px' }}>
          <Form.Item
            name="odds_3_diff_ht"
            rules={[{ required: true }]}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <InputNumber className="w-100" placeholder="Dead" />
          </Form.Item>
          <Form.Item
            name="odds_3_diff"
            rules={[{ required: true }]}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
          >
            <InputNumber className="w-100" placeholder="Live" />
          </Form.Item>
        </Form.Item>
        <ButtonActions />
      </Form>
    </Card>
  )
}

export default LDiff1X2Form
