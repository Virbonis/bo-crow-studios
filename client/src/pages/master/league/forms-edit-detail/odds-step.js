import { Card, Form, InputNumber } from 'antd'
import React, { useEffect } from 'react'

const OddsStepForm = ({ initialValue, ButtonActions, OnFinish }) => {
  const [formOddsStep] = Form.useForm()

  useEffect(() => {
    formOddsStep.setFieldsValue(initialValue)
  })

  return (
    <Card title="Odds Step">
      <Form
        form={formOddsStep}
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 12 }}
        onFinish={OnFinish}
      >
        <Form.Item name="ev_odds_step" label="AH" style={{ marginBottom: '0px' }}>
          <InputNumber className="w-100" placeholder="AH" />
        </Form.Item>
        <Form.Item name="ev_odds_step_ou" label="OU" style={{ marginBottom: '0px' }}>
          <InputNumber className="w-100" placeholder="OU" />
        </Form.Item>
        <Form.Item name="ev_odds_step_timer_ht" label="Timer HT" style={{ marginBottom: '0px' }}>
          <InputNumber className="w-100" placeholder="HT" />
        </Form.Item>
        <Form.Item name="ev_odds_step_timer_ft" label="Timer FT" style={{ marginBottom: '0px' }}>
          <InputNumber className="w-100" placeholder="FT" />
        </Form.Item>
        <ButtonActions />
      </Form>
    </Card>
  )
}

export default OddsStepForm
