import { Card, Form, Select } from 'antd'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = ({ moEdit }) => ({
  specialCodeOptions: moEdit.special_code.map(e => ({
    value: e.special_code,
    label: e.special_name,
  })),
})

const SpecialCodeForm = ({ initialValue, ButtonActions, OnFinish, specialCodeOptions }) => {
  const [formSC] = Form.useForm()

  useEffect(() => {
    formSC.setFieldsValue(initialValue)
  })

  return (
    <Card title="Special Code">
      <Form form={formSC} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} onFinish={OnFinish}>
        <Form.Item name="special_code" label="Special Code">
          <Select options={specialCodeOptions} showSearch />
        </Form.Item>
        <ButtonActions />
      </Form>
    </Card>
  )
}

export default connect(mapStateToProps)(SpecialCodeForm)
