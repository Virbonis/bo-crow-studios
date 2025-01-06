import { Card, Checkbox, Form } from 'antd'
import React, { useEffect } from 'react'

const BetGeniusForm = ({ initialValue, ButtonActions, OnFinish }) => {
  const [formBG] = Form.useForm()

  useEffect(() => {
    formBG.setFieldsValue({ st_booking_bg: initialValue.st_booking_bg === 'Y' })
  })

  return (
    <Card title="Bet Genius">
      <Form
        form={formBG}
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 12 }}
        onFinish={OnFinish}
        labelWrap
      >
        <Form.Item name="st_booking_bg" valuePropName="checked" label="Auto Feeding to BG">
          <Checkbox />
        </Form.Item>
        <ButtonActions />
      </Form>
    </Card>
  )
}

export default BetGeniusForm
