import { Card, Col, Form, InputNumber, Row, Typography } from 'antd'
import React, { useEffect } from 'react'

const { Text } = Typography
const rules = {
  type: 'number',
  min: 0,
  max: 100,
}
const SpreadParlayForm = ({ initialValue, ButtonActions, OnFinish }) => {
  const [formSpreadParlay] = Form.useForm()

  useEffect(() => {
    formSpreadParlay.setFieldsValue(initialValue)
  })

  return (
    <Card title="Spread Parlay">
      <Form
        form={formSpreadParlay}
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
            name="odds_spread_parlay_ah"
            rules={[rules]}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <InputNumber min={0} placeholder="Dead" className="w-100" />
          </Form.Item>
          <Form.Item
            name="odds_spread_parlay_ah_live"
            rules={[rules]}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
          >
            <InputNumber min={0} placeholder="Live" className="w-100" />
          </Form.Item>
        </Form.Item>
        <Form.Item label="OU" style={{ marginBottom: '0px' }}>
          <Form.Item
            name="odds_spread_parlay_ou"
            rules={[rules]}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <InputNumber min={0} placeholder="Dead" className="w-100" />
          </Form.Item>
          <Form.Item
            name="odds_spread_parlay_ou_live"
            rules={[rules]}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
          >
            <InputNumber min={0} placeholder="Live" className="w-100" />
          </Form.Item>
        </Form.Item>
        <ButtonActions />
      </Form>
    </Card>
  )
}

export default SpreadParlayForm
