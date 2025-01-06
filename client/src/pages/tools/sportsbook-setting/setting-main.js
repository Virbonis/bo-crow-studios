import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Col, Divider, Form, InputNumber, Row, Select } from 'antd'
import actions from 'redux/sportsbook-setting/actions'
import { isEmpty } from 'lodash'

const mapStateToProps = ({ sportsbookSetting }) => ({
  data: sportsbookSetting.data,
})

const mapDispatchToProps = (dispatch, { reload }) => ({
  Update: payload => {
    dispatch({
      type: actions.UPDATE_SPORTSBOOK_SETTING,
      payload,
      successCallback: reload,
      source: 'Sportsbook Setting',
    })
  },
})

const DisplayMainForm = ({
  isAllowed,
  data,

  Update,
}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue(data)
  }, [form, data])

  if (isEmpty(data)) return null
  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      labelWrap="true"
      className="w-100"
      onFinish={values => {
        Update(values)
      }}
    >
      <Divider className="my-2" />
      <Form.Item label="Day Light Saving" name="day_light_saving">
        <Select
          disabled={!isAllowed}
          allowClear={false}
          options={[
            { value: 17, label: '5PM' },
            { value: 18, label: '6PM' },
          ]}
          style={{ width: 100 }}
        />
      </Form.Item>
      <Divider className="my-2" />
      <Row>
        <Col span={12}>
          <Form.Item
            label="IB Payout Trigger Amount"
            name="ib_payout_trigger_amt"
            labelCol={{ span: 8 }}
          >
            <InputNumber disabled={!isAllowed} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="IB Max Bet Trigger %"
            name="ib_max_bet_trigger_pct"
            labelCol={{ span: 8 }}
          >
            <InputNumber min={0} max={100} disabled={!isAllowed} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item
            label="Max Bet Pause Trigger %"
            name="max_bet_pause_trigger_pct"
            labelCol={{ span: 8 }}
          >
            <InputNumber min={0} max={100} disabled={!isAllowed} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="LAP Short %" name="lap_short_trigger_pct" labelCol={{ span: 8 }}>
            <InputNumber min={0} max={100} disabled={!isAllowed} />
          </Form.Item>
        </Col>
      </Row>
      <Divider className="my-2" />
      <Row>
        <Col span={12}>
          <Form.Item
            label="Auto Accept Delay Home"
            name="auto_accept_delay_home"
            labelCol={{ span: 8 }}
          >
            <InputNumber min={0} disabled={!isAllowed} addonAfter="Second(s)" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Auto Accept Delay Away"
            name="auto_accept_delay_away"
            labelCol={{ span: 8 }}
          >
            <InputNumber min={0} disabled={!isAllowed} addonAfter="Second(s)" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item
            label="Auto Accept Delay Over"
            name="auto_accept_delay_over"
            labelCol={{ span: 8 }}
          >
            <InputNumber min={0} disabled={!isAllowed} addonAfter="Second(s)" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Auto Accept Delay Under"
            name="auto_accept_delay_under"
            labelCol={{ span: 8 }}
          >
            <InputNumber min={0} disabled={!isAllowed} addonAfter="Second(s)" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item
            label="Auto Accept Delay Reject"
            name="auto_accept_delay_reject"
            labelCol={{ span: 8 }}
          >
            <InputNumber min={0} disabled={!isAllowed} addonAfter="Extra Second(s)" />
          </Form.Item>
        </Col>
      </Row>
      <Divider className="my-2" />
      <Form.Item label="Auto Early Settlement">
        <Form.Item name="auto_early_settlement" noStyle>
          <InputNumber min={0} disabled={!isAllowed} addonAfter="Minute(s)" />
        </Form.Item>
      </Form.Item>
      <Col offset={4}>
        <Button type="primary" htmlType="submit" disabled={!isAllowed}>
          Submit
        </Button>
      </Col>
    </Form>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayMainForm)
