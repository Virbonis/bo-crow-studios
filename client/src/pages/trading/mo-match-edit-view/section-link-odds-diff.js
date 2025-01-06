import React from 'react'
import { connect } from 'react-redux'
import { Card, Checkbox, Divider, Form, Select } from 'antd'
import { isEmpty } from 'lodash'
import { listGT, oddsDiffOptions, spreadDiffOptions } from 'helper'

const mapStateToProps = ({ moEdit }, ownProps) => ({
  match_id: moEdit.editValue.match_id,
  display_admin: moEdit.editValue.display_admin,
  submatch: moEdit.data.submatch?.findLast(x => listGT[ownProps.gt].includes(x.game_type)),
})

const SectionLinkOddsDiff = React.memo(({ display_admin, submatch, gt }) => {
  if (isEmpty(submatch)) return null

  const [form] = Form.useForm()
  React.useEffect(() => {
    form.resetFields()
  }, [submatch, form])

  const display_time = display_admin > 30 ? 'HT' : 'FT'
  const display_text = gt === 'HWNW' || gt === 'AWNW' ? gt : `${display_time} ${gt}`

  return (
    <Form
      size="small"
      labelCol={{ span: 12 }}
      wrapperCol={{ span: 12 }}
      form={form}
      initialValues={{
        ...submatch,
        link_odds_diff_lock: submatch.link_odds_diff_lock === 1,
      }}
    >
      <Card size="small">
        <Divider orientation="left" className="m-0">
          Link Odds Difference ({display_text})
        </Divider>

        <Form.Item label="Diff On Odds" className="mb-0 flex-fill" name="link_odds_diff">
          <Select options={oddsDiffOptions} />
        </Form.Item>
        <Form.Item label="Diff On Spread" className="mb-0" name="link_spread_diff">
          <Select options={spreadDiffOptions} />
        </Form.Item>
        <Form.Item
          className="mb-0"
          name="link_odds_diff_lock"
          valuePropName="checked"
          wrapperCol={{ offset: 12 }}
        >
          <Checkbox>Lock</Checkbox>
        </Form.Item>
      </Card>
    </Form>
  )
})

/**
 * @param {string} gt 'AH' | 'OU' | 'OE'
 */
export default connect(mapStateToProps, null)(SectionLinkOddsDiff)
