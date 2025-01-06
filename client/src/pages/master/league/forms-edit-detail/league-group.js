import { Card, Form, Select } from 'antd'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = ({ leagueGroup }) => ({
  leagueGroupOptions: leagueGroup.data.map(e => ({
    value: e.league_group,
    label: e.league_group,
  })),
})

const LeagueGroupForm = ({ initialValue, ButtonActions, OnFinish, leagueGroupOptions }) => {
  const [formLG] = Form.useForm()

  useEffect(() => {
    formLG.setFieldsValue(initialValue)
  })

  return (
    <Card title="League Group" style={{ marginTop: '8px' }}>
      <Form form={formLG} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} onFinish={OnFinish}>
        <Form.Item name="league_group" label="League Group">
          <Select options={leagueGroupOptions} showSearch />
        </Form.Item>
        <ButtonActions />
      </Form>
    </Card>
  )
}

export default connect(mapStateToProps)(LeagueGroupForm)
