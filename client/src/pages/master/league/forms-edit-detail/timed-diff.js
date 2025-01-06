import { Card, Col, Form, InputNumber, Row, Typography } from 'antd'
import React, { useEffect } from 'react'

const { Text } = Typography
const TimedDiffForm = ({ initialValue, ButtonActions, OnFinish }) => {
  const [formTimedDiff] = Form.useForm()

  useEffect(() => {
    formTimedDiff.setFieldsValue(initialValue)
  })

  return (
    <Card title="Timed MaxBet & MaxLimit Diff">
      <Form
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 24 }}
        labelAlign="left"
        size="small"
        form={formTimedDiff}
        id="timed-maxbet-maxlimit-diff"
        onFinish={OnFinish}
      >
        <Row>
          <Col span={21} offset={3}>
            <Text
              style={{
                display: 'inline-block',
                width: 'calc(16.6% - 6px)',
                fontSize: '12px',
              }}
            >
              Minute1
            </Text>

            <Text
              style={{
                display: 'inline-block',
                width: 'calc(16.6% - 6px)',
                marginLeft: '4px',
                fontSize: '12px',
              }}
            >
              MaxBet1
            </Text>
            <Text
              style={{
                display: 'inline-block',
                width: 'calc(16.6% - 6px)',
                margin: '0 4px',
                fontSize: '12px',
              }}
            >
              MaxLimit1
            </Text>
            <Text
              style={{
                display: 'inline-block',
                width: 'calc(16.6% - 6px)',
                marginLeft: '8px',
                fontSize: '12px',
              }}
            >
              Minute2
            </Text>
            <Text
              style={{
                display: 'inline-block',
                width: 'calc(16.6% - 6px)',
                marginLeft: '4px',
                fontSize: '12px',
              }}
            >
              MaxBet2
            </Text>
            <Text
              style={{
                display: 'inline-block',
                width: 'calc(16.6% - 6px)',
                margin: '0 4px',
                fontSize: '12px',
              }}
            >
              MaxLimit2
            </Text>
          </Col>
        </Row>
        <Form.Item label="AH" style={{ marginBottom: '0px' }}>
          <Form.Item
            name="max_bet_timer_ah_ft"
            rules={[{ required: true }]}
            style={{ display: 'inline-block', width: 'calc(16.6% - 6px)' }}
          >
            <InputNumber min={0} className="w-100" placeholder="Dead" />
          </Form.Item>
          <Form.Item
            name="max_bet_percent_ah_ft"
            rules={[{ required: true }]}
            style={{
              display: 'inline-block',
              width: 'calc(16.6% - 6px)',
              marginLeft: '4px',
            }}
          >
            <InputNumber min={0} className="w-100" placeholder="Live" />
          </Form.Item>
          <Form.Item
            name="max_limit_percent_ah_ft"
            rules={[{ required: true }]}
            style={{
              display: 'inline-block',
              width: 'calc(16.6% - 6px)',
              margin: '0 4px',
            }}
          >
            <InputNumber min={0} className="w-100" placeholder="Live" />
          </Form.Item>
          <Form.Item
            name="max_bet_timer_ah_ft_2"
            rules={[{ required: true }]}
            style={{
              display: 'inline-block',
              width: 'calc(16.6% - 6px)',
              marginLeft: '8px',
            }}
          >
            <InputNumber min={0} className="w-100" placeholder="Dead" />
          </Form.Item>
          <Form.Item
            name="max_bet_percent_ah_ft_2"
            rules={[{ required: true }]}
            style={{
              display: 'inline-block',
              width: 'calc(16.6% - 6px)',
              marginLeft: '4px',
            }}
          >
            <InputNumber min={0} className="w-100" placeholder="Live" />
          </Form.Item>
          <Form.Item
            name="max_limit_percent_ah_ft_2"
            rules={[{ required: true }]}
            style={{
              display: 'inline-block',
              width: 'calc(16.6% - 6px)',
              margin: '0 4px',
            }}
          >
            <InputNumber min={0} className="w-100" placeholder="Live" />
          </Form.Item>
        </Form.Item>
        <Form.Item label="OU" style={{ marginBottom: '0px' }}>
          <Form.Item
            name="max_bet_timer_ou_ft"
            rules={[{ required: true }]}
            style={{ display: 'inline-block', width: 'calc(16.6% - 6px)' }}
          >
            <InputNumber min={0} className="w-100" placeholder="Dead" />
          </Form.Item>
          <Form.Item
            name="max_bet_percent_ou_ft"
            rules={[{ required: true }]}
            style={{
              display: 'inline-block',
              width: 'calc(16.6% - 6px)',
              marginLeft: '4px',
            }}
          >
            <InputNumber min={0} className="w-100" placeholder="Live" />
          </Form.Item>
          <Form.Item
            name="max_limit_percent_ou_ft"
            rules={[{ required: true }]}
            style={{
              display: 'inline-block',
              width: 'calc(16.6% - 6px)',
              margin: '0 4px',
            }}
          >
            <InputNumber min={0} className="w-100" placeholder="Live" />
          </Form.Item>
          <Form.Item
            name="max_bet_timer_ou_ft_2"
            rules={[{ required: true }]}
            style={{
              display: 'inline-block',
              width: 'calc(16.6% - 6px)',
              marginLeft: '8px',
            }}
          >
            <InputNumber min={0} className="w-100" placeholder="Dead" />
          </Form.Item>
          <Form.Item
            name="max_bet_percent_ou_ft_2"
            rules={[{ required: true }]}
            style={{
              display: 'inline-block',
              width: 'calc(16.6% - 6px)',
              marginLeft: '4px',
            }}
          >
            <InputNumber min={0} className="w-100" placeholder="Live" />
          </Form.Item>
          <Form.Item
            name="max_limit_percent_ou_ft_2"
            rules={[{ required: true }]}
            style={{
              display: 'inline-block',
              width: 'calc(16.6% - 6px)',
              margin: '0 4px',
            }}
          >
            <InputNumber min={0} className="w-100" placeholder="Live" />
          </Form.Item>
        </Form.Item>
        <Form.Item label="HT AH" style={{ marginBottom: '0px' }}>
          <Form.Item
            name="max_bet_timer_ah_ht"
            rules={[{ required: true }]}
            style={{ display: 'inline-block', width: 'calc(16.6% - 6px)' }}
          >
            <InputNumber min={0} className="w-100" placeholder="Dead" />
          </Form.Item>
          <Form.Item
            name="max_bet_percent_ah_ht"
            rules={[{ required: true }]}
            style={{
              display: 'inline-block',
              width: 'calc(16.6% - 6px)',
              marginLeft: '4px',
            }}
          >
            <InputNumber min={0} className="w-100" placeholder="Live" />
          </Form.Item>
          <Form.Item
            name="max_limit_percent_ah_ht"
            rules={[{ required: true }]}
            style={{
              display: 'inline-block',
              width: 'calc(16.6% - 6px)',
              margin: '0 4px',
            }}
          >
            <InputNumber min={0} className="w-100" placeholder="Live" />
          </Form.Item>
        </Form.Item>
        <Form.Item label="HT OU" style={{ marginBottom: '0px' }}>
          <Form.Item
            name="max_bet_timer_ou_ht"
            rules={[{ required: true }]}
            style={{ display: 'inline-block', width: 'calc(16.6% - 6px)' }}
          >
            <InputNumber min={0} className="w-100" placeholder="Dead" />
          </Form.Item>
          <Form.Item
            name="max_bet_percent_ou_ht"
            rules={[{ required: true }]}
            style={{
              display: 'inline-block',
              width: 'calc(16.6% - 6px)',
              marginLeft: '4px',
            }}
          >
            <InputNumber min={0} className="w-100" placeholder="Live" />
          </Form.Item>
          <Form.Item
            name="max_limit_percent_ou_ht"
            rules={[{ required: true }]}
            style={{
              display: 'inline-block',
              width: 'calc(16.6% - 6px)',
              margin: '0 4px',
            }}
          >
            <InputNumber min={0} className="w-100" placeholder="Live" />
          </Form.Item>
        </Form.Item>
        <ButtonActions />
      </Form>
    </Card>
  )
}

export default TimedDiffForm
