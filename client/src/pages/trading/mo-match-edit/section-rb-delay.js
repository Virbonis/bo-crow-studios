import React from 'react'
import { connect } from 'react-redux'
import { Button, Card, Col, Divider, Form, InputNumber, Row, Typography } from 'antd'
import actions from 'redux/mo-match-edit/actions'

const { Text } = Typography

const mapStateToProps = ({ moEdit }) => ({
  match: moEdit.data.match,
})
const mapDispatchToProps = dispatch => ({
  UpdateRBDelay: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_RBDelay,
      payload,
      successCallback,
    })
  },
})

const SectionRBDelay = ({ match, UpdateRBDelay, readOnly }) => {
  const [form] = Form.useForm()
  React.useEffect(() => {
    form.resetFields()
  }, [match, form])

  return (
    <Form
      size="small"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      form={form}
      initialValues={match}
      onFinish={values => {
        UpdateRBDelay({
          match_id: match.match_id,
          ...values,
        })
      }}
    >
      <Card size="small">
        <Divider orientation="left" className="m-0">
          RB Acceptance Delay
        </Divider>
        <Row>
          <Col span={12}>
            <Form.Item
              className="mb-0"
              label="Home"
              name="auto_accept_delay_home"
              rules={[{ required: true, message: '' }]}
            >
              <InputNumber className="w-100" min={0} max={9999} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="mb-0"
              label="Away"
              name="auto_accept_delay_away"
              rules={[{ required: true, message: '' }]}
            >
              <InputNumber className="w-100" min={0} max={9999} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="mb-0"
              label="Over"
              name="auto_accept_delay_over"
              rules={[{ required: true, message: '' }]}
            >
              <InputNumber className="w-100" min={0} max={9999} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="mb-0"
              label="Under"
              name="auto_accept_delay_under"
              rules={[{ required: true, message: '' }]}
            >
              <InputNumber className="w-100" min={0} max={9999} />
            </Form.Item>
          </Col>
        </Row>
        <Text className="text-danger">
          *Kindly set the Match Time to &quot;1st Start&quot; after kickoff
        </Text>
        {!readOnly && (
          <Divider orientation="right" className="m-0">
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Divider>
        )}
      </Card>
    </Form>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(SectionRBDelay)
