import { Card, Form, InputNumber } from 'antd'
import React, { useEffect } from 'react'

const LeagueParentForm = ({ initialValue, ButtonActions, OnFinish }) => {
  const [formParentLeague] = Form.useForm()

  useEffect(() => {
    formParentLeague.setFieldsValue(initialValue)
  })

  return (
    <Card title="Parent League ID">
      <Form
        form={formParentLeague}
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 12 }}
        onFinish={OnFinish}
        labelWrap
      >
        <Form.Item name="parent_league_id" label="Parent League ID">
          <InputNumber className="w-100" placeholder="ID" />
        </Form.Item>
        <ButtonActions />
      </Form>
    </Card>
  )
}

export default LeagueParentForm
