import React from 'react'
import { connect } from 'react-redux'
import { Button, Card, Divider, Form, InputNumber } from 'antd'
import { isEmpty } from 'lodash'
import actions from 'redux/mo-match-edit/actions'
import { getGameTypeDescriptionShort, listGT } from 'helper'

const mapStateToProps = ({ moEdit }, ownProps) => ({
  match_id: moEdit.editValue.match_id,
  display_admin: moEdit.editValue.display_admin,
  match: moEdit.data.match,
  submatch: moEdit.data.submatch?.findLast(x => listGT[ownProps.gt].includes(x.game_type)),
})
const mapDispatchToProps = dispatch => ({
  UpdateTimedMaxBet: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_TIMED_MAX_BET,
      payload,
      successCallback,
    })
  },
})

const SectionTimedMaxBet = ({ match_id, match, submatch, UpdateTimedMaxBet, time, readOnly }) => {
  const [form] = Form.useForm()
  React.useEffect(() => {
    form.resetFields()
  }, [submatch, form])

  if (isEmpty(submatch)) return null

  const display_text = getGameTypeDescriptionShort(submatch.game_type)
  return (
    <Form
      size="small"
      labelCol={{ span: 16 }}
      wrapperCol={{ span: 8 }}
      form={form}
      initialValues={{
        ...submatch,
        timed_maxbet_diff_minute:
          time === 1 ? submatch.timed_maxbet_diff_minute : submatch.timed_maxbet_diff_minute_2,
        timed_maxbet_diff: time === 1 ? submatch.timed_maxbet_diff : submatch.timed_maxbet_diff_2,
        timed_maxlimit_diff:
          time === 1 ? submatch.timed_maxlimit_diff : submatch.timed_maxlimit_diff_2,
      }}
      onFinish={values => {
        UpdateTimedMaxBet({
          time,
          match_id,
          sub_match_id: submatch.sub_match_id,
          ...values,
        })
      }}
    >
      <Card size="small">
        <Divider orientation="left" className="m-0">
          Timed MaxBet & MaxLimit Diff {time} ({display_text})
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
        <Form.Item
          className="mb-0"
          label="Diff On MaxLimit"
          name="timed_maxlimit_diff"
          rules={[{ required: true, message: '' }]}
        >
          <InputNumber className="w-100" min={0} max={100} addonAfter="%" />
        </Form.Item>

        {!readOnly && (
          <Divider orientation="right" className="m-0">
            {match.st_etpen === 'N' && (
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            )}
          </Divider>
        )}
      </Card>
    </Form>
  )
}

/**
 * @param {string} gt 'AHSW' | 'OUGOU'
 * @param {number} time 1 | 2
 */
export default connect(mapStateToProps, mapDispatchToProps)(SectionTimedMaxBet)
