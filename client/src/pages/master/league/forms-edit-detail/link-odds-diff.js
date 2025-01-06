import React from 'react'
import { getGameTypeDescriptionShort, oddsDiffOptions, spreadDiffOptions } from 'helper'
import { Card, Checkbox, Form, Select } from 'antd'

const LinkOddsDiff = ({ game_type, initialValue, onFinish, ButtonActions }) => {
  const [form] = Form.useForm()
  React.useEffect(() => {
    form.setFieldsValue(initialValue)
  })

  const display_text = getGameTypeDescriptionShort(game_type)
  return (
    <Card title={<>Link Odds Difference ({display_text})</>}>
      <Form form={form} labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} onFinish={onFinish}>
        <Form.Item label="Diff On Odds" className="mb-0 flex-fill" name="link_odds_diff">
          <Select options={oddsDiffOptions} />
        </Form.Item>
        <Form.Item label="Diff On Spread" className="mb-0" name="link_odds_spread">
          <Select options={spreadDiffOptions} />
        </Form.Item>
        <Form.Item className="mb-0" label="Lock" name="link_odds_diff_lock" valuePropName="checked">
          <Checkbox />
        </Form.Item>
        <ButtonActions />
      </Form>
    </Card>
  )
}

/**
 * @param {number} game_type 0/2/5/6
 */
export default LinkOddsDiff
