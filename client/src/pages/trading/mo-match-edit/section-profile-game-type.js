import React from 'react'
import { connect } from 'react-redux'
import { Button, Card, Divider, Form, InputNumber, Select } from 'antd'
import { isEmpty } from 'lodash'
import actions from 'redux/mo-match-edit/actions'
import { onlyNumber } from 'utils'
import { getGameTypeDescriptionShort, listGT, oddsDiffOptions } from 'helper'
import { Amount } from 'components/blaise'

const mapStateToProps = ({ moEdit }, ownProps) => ({
  match_id: moEdit.editValue.match_id,
  display_admin: moEdit.editValue.display_admin,
  submatch:
    ownProps.gt === '1X2'
      ? moEdit.data.submatch_1X2
      : moEdit.data.submatch?.findLast(x => listGT[ownProps.gt].includes(x.game_type)),
})
const mapDispatchToProps = dispatch => ({
  UpdateProfileGameType: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_PROFILE_GAMETYPE,
      payload,
      successCallback,
    })
  },
})

const SectionProfileGameType = ({ match_id, submatch, UpdateProfileGameType, gt, readOnly }) => {
  const [form] = Form.useForm()
  React.useEffect(() => {
    form.resetFields()
  }, [submatch, form])

  if (isEmpty(submatch)) return null

  const display_text = getGameTypeDescriptionShort(submatch.game_type)
  return (
    <Form
      size="small"
      form={form}
      initialValues={submatch}
      onFinish={values =>
        UpdateProfileGameType({
          match_id,
          sub_match_id: submatch.sub_match_id,
          game_type: submatch.game_type,
          ...values,
        })
      }
    >
      <Card size="small" style={{ maxWidth: 400 }}>
        <Divider orientation="left" className="m-0">
          ({display_text})
        </Divider>
        <Content gt={gt} submatch={submatch} />

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
const Content = ({ gt, submatch }) => {
  if (gt === '1X2')
    return (
      <>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '8.5fr 10fr 10fr 10fr',
            gap: '7.5px 5px',
          }}
        >
          <div />
          <div>1(H)</div>
          <div>2(H)</div>
          <div>X(D)</div>

          <div>Odds</div>
          <Form.Item className="mb-0" name="odds1">
            <InputNumber className="w-100" disabled />
          </Form.Item>
          <Form.Item className="mb-0" name="odds2">
            <InputNumber className="w-100" disabled />
          </Form.Item>
          <Form.Item className="mb-0" name="odds3">
            <InputNumber className="w-100" disabled />
          </Form.Item>
          <div>L.Diff</div>
          <Form.Item className="mb-0" name="oddsdiff1">
            <Select options={oddsDiffOptions} />
          </Form.Item>
          <Form.Item className="mb-0" name="oddsdiff2">
            <Select options={oddsDiffOptions} />
          </Form.Item>
          <Form.Item className="mb-0" name="oddsdiff3">
            <Select options={oddsDiffOptions} />
          </Form.Item>
          <div>Cur Payout</div>
          <div>
            <Amount value={submatch?.maxpayout1} int />
          </div>
          <div>
            <Amount value={submatch?.maxpayout2} int />
          </div>
          <div>
            <Amount value={submatch?.maxpayout3} int />
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '8.5fr 15fr 15fr',
            paddingTop: '7.5px',
            paddingBottom: '65px',
            columnGap: '5px',
          }}
        >
          <div>LAP</div>
          <Form.Item label="Dead" className="mb-0" name="lap">
            <InputNumber
              controls={false}
              className="w-100"
              maxLength={12}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              onKeyPress={onlyNumber}
            />
          </Form.Item>
          <Form.Item label="Live" className="mb-0" name="laplive">
            <InputNumber
              controls={false}
              className="w-100"
              maxLength={12}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              onKeyPress={onlyNumber}
            />
          </Form.Item>
        </div>
      </>
    )
  // AH/SW/OU/OE/ML/GAH/HWNW/AWNW
  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '3fr 5fr 10fr 10fr 10fr',
          gap: '7.5px 5px',
        }}
      >
        <div />
        <div>Step</div>
        <div>Odds Trigger</div>
        <div>Max Limit</div>
        <div>Max Bet</div>
        <div>EM</div>
        {generateInput(2)}
        <div>TM</div>
        {generateInput(1)}
        <div>TM6</div>
        {generateInput(4)}
        <div>RB</div>
        {generateInput(3)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', paddingTop: '7.5px' }}>
        <Form.Item
          className="mb-0"
          label="LAP Long"
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 12 }}
        >
          <Amount value={submatch?.lap_long} int />
        </Form.Item>
        <Form.Item
          className="mb-0"
          label="CAP Long"
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 12 }}
        >
          <Amount value={submatch?.cap_long} int />
        </Form.Item>
        <Form.Item
          className="mb-0"
          label="LAP Short"
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 12 }}
        >
          <Amount value={submatch?.lap_short} int />
        </Form.Item>
        <Form.Item
          className="mb-0"
          label="CAP Short"
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 12 }}
        >
          <Amount value={submatch?.cap_short} int />
        </Form.Item>
      </div>
    </>
  )
}
const generateInput = i => {
  return (
    <>
      <Form.Item className="mb-0" name={`step_${i}`} rules={[{ required: true, message: '' }]}>
        <InputNumber controls={false} className="w-100" maxLength={3} onKeyPress={onlyNumber} />
      </Form.Item>
      <Form.Item
        className="mb-0"
        name={`odds_trigger_${i}`}
        rules={[{ required: true, message: '' }]}
      >
        <InputNumber
          controls={false}
          className="w-100"
          maxLength={12}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          onKeyPress={onlyNumber}
        />
      </Form.Item>
      <Form.Item className="mb-0" name={`max_limit_${i}`} rules={[{ required: true, message: '' }]}>
        <InputNumber
          controls={false}
          className="w-100"
          maxLength={12}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          onKeyPress={onlyNumber}
        />
      </Form.Item>
      <Form.Item className="mb-0" name={`max_bet_${i}`} rules={[{ required: true, message: '' }]}>
        <InputNumber
          controls={false}
          className="w-100"
          maxLength={12}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          onKeyPress={onlyNumber}
        />
      </Form.Item>
    </>
  )
}
/**
 * @param {string} gt 'AHSW' | 'GAH' | 'OUGOU' | 'OEGOE' | 'ML'
 */
export default connect(mapStateToProps, mapDispatchToProps)(SectionProfileGameType)
