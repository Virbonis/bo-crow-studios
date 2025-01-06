import React from 'react'
import { connect } from 'react-redux'
import { Card, Col, Divider, Form, InputNumber, Row, Typography } from 'antd'
import { isEmpty } from 'lodash'

const { Text } = Typography

const mapStateToProps = ({ moEdit }) => ({
  match_id: moEdit.editValue.match_id,
  match: moEdit.data.match,
})

const SectionRBDelay = React.memo(({ match }) => {
  if (isEmpty(match)) return null

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
      initialValues={{ ...match }}
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
      </Card>
    </Form>
  )
})

export default connect(mapStateToProps, null)(SectionRBDelay)
