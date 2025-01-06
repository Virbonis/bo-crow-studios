import React from 'react'
import { Button, Checkbox, Col, Form, InputNumber, Row, Select } from 'antd'
import { Amount } from 'components/blaise'
import StatusAutoOdds from 'helper/status-auto-odds'
import SubMatchProfile from './sub-match-profile'

const pauseSelectionOptions = [
  { value: 0, label: 'None' },
  { value: 3, label: 'All' },
]

// Sub Match Setting AH(0/2), OU(5/6), OE(3/16), ML(12), WNW(63/64)
const SubSettingAHOUOEML = ({
  // match_id,
  // sub_match_id,
  game_type,
  match_time_slot,

  oddsSpreadOptions,

  initialValuesProfile,
  initialValuesSetting,
  onFinishSetting,
  onFinishProfile,
}) => {
  const [formSetting] = Form.useForm()
  const { lap_long, lap_short, cap_long, cap_short, follow_leeching } = initialValuesProfile

  React.useEffect(() => {
    formSetting.resetFields()
  }, [formSetting, initialValuesProfile, initialValuesSetting])

  return (
    <>
      <SubMatchProfile
        initialValuesProfile={initialValuesProfile}
        onFinishProfile={onFinishProfile}
      />
      <Form
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 12 }}
        labelAlign="right"
        form={formSetting}
        initialValues={initialValuesSetting}
        onFinish={onFinishSetting}
      >
        <Row>
          <Col span={8}>
            <Form.Item label="LAP Long">
              <Amount value={lap_long} />
            </Form.Item>
            <Form.Item label="LAP Short">
              <Amount value={lap_short} />
            </Form.Item>
            <Form.Item label="CAP Long">
              <Amount value={cap_long} />
            </Form.Item>
            <Form.Item label="CAP Short">
              <Amount value={cap_short} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="shift_leeching" label="Shift Leeching">
              <InputNumber controls={false} maxLength={3} />
            </Form.Item>
            <Form.Item name="lock_leeching" label="Lock Leeching" valuePropName="checked">
              <Checkbox disabled={[63, 64].includes(game_type)} />
            </Form.Item>
            <Form.Item label="Follow Leeching">{StatusAutoOdds(follow_leeching)}</Form.Item>
            <Form.Item name="auto_pause" label="Auto Pause" valuePropName="checked">
              <Checkbox />
            </Form.Item>
            <Form.Item name="sub_match_pause_status" label="Pause Selection">
              <Select options={pauseSelectionOptions} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="odds_spread" label="Spread">
              <Select options={oddsSpreadOptions} />
            </Form.Item>
            <Form.Item name="sub_match_parlay_status" label="Parlay" valuePropName="checked">
              <Checkbox />
            </Form.Item>
          </Col>
        </Row>
        {/* TO DO: AutoAddSubMatchMore.aspx */}
        {match_time_slot !== 'Started' && (
          <div align="right">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        )}
      </Form>
    </>
  )
}

export default SubSettingAHOUOEML
