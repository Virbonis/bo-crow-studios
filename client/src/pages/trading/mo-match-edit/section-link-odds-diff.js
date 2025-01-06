import React from 'react'
import { connect } from 'react-redux'
import { Button, Card, Checkbox, Divider, Form, Select } from 'antd'
import { isEmpty } from 'lodash'
import actions from 'redux/mo-match-edit/actions'
import {
  // gameTypeDescription,
  getGameTypeDescriptionShort,
  listGT,
  oddsDiffOptions,
  spreadDiffOptions,
} from 'helper'

const mapStateToProps = ({ moEdit }, ownProps) => ({
  match_id: moEdit.editValue.match_id,
  display_admin: moEdit.editValue.display_admin,
  submatch: moEdit.data.submatch?.findLast(x => listGT[ownProps.gt].includes(x.game_type)),
})
const mapDispatchToProps = dispatch => ({
  UpdateLinkOdds: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_LINK_ODDS,
      payload,
      successCallback,
    })
  },
})

const SectionLinkOddsDiff = ({ match_id, submatch, UpdateLinkOdds, readOnly }) => {
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
        link_odds_diff_lock: submatch.link_odds_diff_lock === 1,
      }}
      onFinish={values => {
        UpdateLinkOdds({
          match_id,
          sub_match_id: submatch.sub_match_id,
          ...values,
          link_odds_diff_lock: values.link_odds_diff_lock ? 1 : 0,
        })
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
        <Form.Item className="mb-0" label="Lock" name="link_odds_diff_lock" valuePropName="checked">
          <Checkbox />
        </Form.Item>
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

/**
 * @param {string} gt 'AHSW' | 'GAH' | 'OUGOU' | 'OEGOE' | 'ML'
 */
export default connect(mapStateToProps, mapDispatchToProps)(SectionLinkOddsDiff)
