import React from 'react'
import { Form, InputNumber } from 'antd'

const FormForecast = ({ onSubmit }) => {
  const [form] = Form.useForm()
  const inputRef = React.useRef()

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.select()
    }
  }, [])

  return (
    <Form
      id="form-forecast"
      size="small"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      form={form}
      initialValues={{ score_home: 0, score_away: 0 }}
      onFinish={onSubmit}
    >
      <Form.Item label="Home" name="score_home" className="mb-0">
        <InputNumber ref={inputRef} onFocus={e => e.target.select()} />
      </Form.Item>
      <Form.Item label="Away" name="score_away" className="mb-0">
        <InputNumber onFocus={e => e.target.select()} />
      </Form.Item>
    </Form>
  )
}

export default FormForecast
