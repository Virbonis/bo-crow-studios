import { Card, Col, Form, InputNumber, Row, Typography } from 'antd'
import React, { useEffect } from 'react'

const { Text } = Typography
const OddsDiffForm = ({ initialValue, ButtonActions, OnFinish }) => {
  const [formOddsDiffs] = Form.useForm()

  useEffect(() => {
    formOddsDiffs.setFieldsValue(initialValue)
  })

  return (
    <Card title="Odds Point Diff (Pink Colour)">
      <Form
        form={formOddsDiffs}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={OnFinish}
      >
        <Row>
          <Col span={6} />
          <Col span={9}>
            <Text>DEAD</Text>
          </Col>
          <Col span={9}>
            <Text>LIVE</Text>
          </Col>
        </Row>

        <Form.Item label="AH" style={{ marginBottom: '0px' }}>
          <Form.Item
            name="odds_point_diff_ah"
            rules={[{ required: true }]}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <InputNumber min={0} className="w-100" placeholder="Dead" />
          </Form.Item>
          <Form.Item
            name="odds_point_diff_ah_live"
            rules={[{ required: true }]}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
          >
            <InputNumber min={0} className="w-100" placeholder="Live" />
          </Form.Item>
        </Form.Item>
        <Form.Item label="OU" style={{ marginBottom: '0px' }}>
          <Form.Item
            name="odds_point_diff_ou"
            rules={[{ required: true }]}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <InputNumber min={0} className="w-100" placeholder="Dead" />
          </Form.Item>
          <Form.Item
            name="odds_point_diff_ou_live"
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

export default OddsDiffForm
