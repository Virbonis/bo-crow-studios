import React from 'react'
import { connect } from 'react-redux'
import { Card, Divider, Form, InputNumber } from 'antd'
import { isEmpty } from 'lodash'
import { isGameType } from 'helper'

const mapStateToProps = ({ moEdit }, ownProps) => ({
  match_id: moEdit.editValue.match_id,
  display_admin: moEdit.editValue.display_admin,

  match: moEdit.data.match,
  submatch: moEdit.data.submatch?.findLast(x => isGameType(x.game_type, ownProps.gt)),
})

const SectionTimedMaxBet = React.memo(({ display_admin, submatch, gt, time }) => {
  if (isEmpty(submatch)) return null

  const [form] = Form.useForm()
  React.useEffect(() => {
    form.resetFields()
  }, [submatch, form])

  const display_time = display_admin > 30 ? 'HT' : 'FT'

  return (
    <Form
      size="small"
      labelCol={{ span: 12 }}
      wrapperCol={{ span: 12 }}
      form={form}
      initialValues={{
        ...submatch,
        timed_maxbet_diff_minute:
          time === 1 ? submatch.timed_maxbet_diff_minute : submatch.timed_maxbet_diff_minute_2,
        timed_maxbet_diff: time === 1 ? submatch.timed_maxbet_diff : submatch.timed_maxbet_diff_2,
      }}
    >
      <Card size="small">
        <Divider orientation="left" className="m-0">
          Timed MaxBet & MaxLimit Diff ({display_time} {gt})
        </Divider>

        <Form.Item
          className="mb-0"
          label="Minute"
          name="timed_maxbet_diff_minute"
          rules={[{ required: true, message: '' }]}
        >
          <InputNumber className="w-100" min={0} max={90} />
        </Form.Item>
        <Form.Item
          className="mb-0"
          label="Diff On MaxBet"
          name="timed_maxbet_diff"
          rules={[{ required: true, message: '' }]}
        >
          <InputNumber className="w-100" min={0} max={100} addonAfter="%" />
        </Form.Item>
      </Card>
    </Form>
  )
})

/**
 * @param {string} gt 'AH' | 'OU'
 * @param {number} time 1 | 2
 */
export default connect(mapStateToProps, null)(SectionTimedMaxBet)
