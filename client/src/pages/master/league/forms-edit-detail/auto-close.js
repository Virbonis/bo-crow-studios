import React from 'react'
import { Card, Form, TimePicker } from 'antd'
import dayjs from 'dayjs'

const AutoCloseForm = ({ initialValue, ButtonActions, OnFinish }) => {
  const [formAC] = Form.useForm()

  React.useEffect(() => {
    if (initialValue.auto_close_interval)
      formAC.setFieldsValue({
        auto_close_interval: dayjs(initialValue.auto_close_interval, 'HH:mm:ss'),
      })
  }, [initialValue.auto_close_interval, formAC])

  return (
    <Card title="Auto Close">
      <Form form={formAC} labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} onFinish={OnFinish}>
        <Form.Item
          name="auto_close_interval"
          label="Interval"
          initialValue={dayjs('00:00:00', 'HH:mm:ss')}
        >
          <TimePicker showNow={false} allowClear={false} className="w-100" format="HH:mm:ss" />
        </Form.Item>
        <ButtonActions />
      </Form>
    </Card>
  )
}

export default AutoCloseForm
