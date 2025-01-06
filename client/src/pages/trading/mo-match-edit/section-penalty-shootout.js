import React from 'react'
import { connect } from 'react-redux'
import { Button, Card, Checkbox, Divider, Form, Space } from 'antd'
import actions from 'redux/mo-match-edit/actions'

const mapStateToProps = ({ moEdit }) => ({
  match: moEdit.data.match,
})
const mapDispatchToProps = dispatch => ({
  AddPenaltyShootOut: (payload, successCallback) => {
    dispatch({
      type: actions.ADD_PENALTY_SHOOT_OUT,
      payload,
      successCallback,
    })
  },
})

const SectionPenaltyShootout = ({ match, AddPenaltyShootOut }) => {
  const [form] = Form.useForm()
  React.useEffect(() => {
    form.resetFields()
  }, [match, form])

  if (match.sport_id !== 10 || match.match_live_status !== 'Y') return null
  return (
    <Form
      size="small"
      labelCol={{ span: 0 }}
      wrapperCol={{ span: 24 }}
      form={form}
      initialValues={{
        ...match,
      }}
      onFinish={values => {
        AddPenaltyShootOut({
          match_id: match.match_id,
          penalty_shoot_out: values.penalty_shoot_out.sort(),
        })
      }}
    >
      <Card size="small">
        <Divider orientation="left" className="m-0">
          + Add Penalty Shoot-Out
        </Divider>
        <Form.Item className="mb-0" name="penalty_shoot_out">
          <Checkbox.Group>
            <Space direction="vertical" size={0}>
              <Checkbox value="1st">1st Penalty - Goal/No Goal</Checkbox>
              <Checkbox value="2nd">2nd Penalty - Goal/No Goal</Checkbox>
              <Checkbox value="3rd">3rd Penalty - Goal/No Goal</Checkbox>
              <Checkbox value="4th">4th Penalty - Goal/No Goal</Checkbox>
              <Checkbox value="5th">5th Penalty - Goal/No Goal</Checkbox>
            </Space>
          </Checkbox.Group>
        </Form.Item>

        <Divider orientation="right" className="m-0">
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Divider>
      </Card>
    </Form>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(SectionPenaltyShootout)
