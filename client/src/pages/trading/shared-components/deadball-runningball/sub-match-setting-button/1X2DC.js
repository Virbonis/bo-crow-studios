import React from 'react'
import { Button, Checkbox, Col, Form, InputNumber, Row } from 'antd'
import StatusAutoOdds from 'helper/status-auto-odds'
import { countOddsMargin } from 'helper'
import { Amount } from 'components/blaise'

// Sub Match Setting 1X2(1/8), DC(15)
const SubSetting1X2DC = ({
  game_type,
  match_time_slot,

  initialValuesSetting,
  onFinishSetting,
}) => {
  const [formSetting] = Form.useForm()
  const { follow_leeching } = initialValuesSetting
  const isDC = game_type === 15

  React.useEffect(() => {
    formSetting.resetFields()
  }, [formSetting, initialValuesSetting])

  return (
    <Form
      labelCol={{ span: 12 }}
      wrapperCol={{ span: 12 }}
      labelAlign="right"
      form={formSetting}
      initialValues={initialValuesSetting}
      onFinish={onFinishSetting}
      onValuesChange={(changedValues, allValues) => {
        const fieldName = Object.keys(changedValues)[0]
        if (['odds1', 'odds2', 'odds3', 'spread'].includes(fieldName)) {
          // home=odds1, draw=odds2, away=odds3
          const { odds1, odds2, odds3 } = allValues
          formSetting.setFieldsValue({
            odds_margin: countOddsMargin([odds1, odds2, odds3]),
            // previewOdds: countOdds1X2(odds_home, odds_draw, odds_away, spread, st_fav),
          })
        }
      }}
    >
      <Row>
        <Col span={8}>
          <Form.Item name="odds1" label={isDC ? 'Home/Draw (1X)' : 'Home'}>
            <InputNumber step={0.01} min={0} />
          </Form.Item>
          <Form.Item name="odds2" label={isDC ? 'Home/Away (12)' : 'Away'}>
            <InputNumber step={0.01} min={0} />
          </Form.Item>
          <Form.Item name="odds3" label={isDC ? 'Draw/Away (X2)' : 'Draw'}>
            <InputNumber step={0.01} min={0} />
          </Form.Item>
          <Form.Item name="odds_margin" label="% margin">
            <Amount />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="lock_leeching" label="Lock Leeching" valuePropName="checked">
            <Checkbox disabled />
          </Form.Item>
          <Form.Item label="Follow Leeching">{StatusAutoOdds(follow_leeching)}</Form.Item>
          <Form.Item name="auto_pause" label="Auto Pause" valuePropName="checked">
            <Checkbox disabled />
          </Form.Item>
          <Form.Item name="sub_match_parlay_status" label="Parlay" valuePropName="checked">
            <Checkbox />
          </Form.Item>
        </Col>
      </Row>
      {isDC && match_time_slot !== 'Started' && (
        <div align="right">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </div>
      )}
    </Form>
  )
}

export default SubSetting1X2DC
