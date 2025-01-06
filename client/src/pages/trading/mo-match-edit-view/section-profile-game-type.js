import React from 'react'
import { connect } from 'react-redux'
import { Card, Divider, Form, InputNumber, Select } from 'antd'
import { isEmpty } from 'lodash'
import { onlyNumber } from 'utils'
import { isGameType, oddsDiffOptions } from 'helper'
import { Amount } from 'components/blaise'

const mapStateToProps = ({ moEdit }, ownProps) => ({
  match_id: moEdit.editValue.match_id,
  submatch:
    ownProps.gt === '1X2'
      ? moEdit.data.submatch_1X2
      : moEdit.data.submatch?.findLast(x => isGameType(x.game_type, ownProps.gt)),
})

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
const SectionProfileGameType = React.memo(
  ({ match_id, display_admin, submatch, UpdateProfileGameType, gt }) => {
    if (isEmpty(submatch)) return null

    const [form] = Form.useForm()
    React.useEffect(() => {
      form.resetFields()
    }, [submatch, form])

    const display_time = display_admin > 30 ? 'HT' : 'FT'
    const display_text = gt === 'HWNW' || gt === 'AWNW' ? gt : `${display_time} ${gt}`

    if (
      gt === 'AH' ||
      gt === 'OU' ||
      gt === 'OE' ||
      gt === 'ML' ||
      gt === 'GAH' ||
      gt === 'HWNW' ||
      gt === 'AWNW'
    )
      return (
        <Form
          size="small"
          form={form}
          initialValues={{
            ...submatch,
          }}
          onFinish={values =>
            UpdateProfileGameType({
              match_id,
              sub_match_id: submatch.sub_match_id,
              game_type: submatch.game_type,
              ...values,
            })
          }
        >
          <Card size="small">
            <Divider orientation="left" className="m-0">
              ({display_text})
            </Divider>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '30px 50px 100px 100px 100px',
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

            <div style={{ display: 'grid', gridTemplateColumns: '50% 50%', paddingTop: '7.5px' }}>
              <Form.Item
                className="mb-0"
                label="LAP Long"
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
              >
                {submatch?.lap_long}
              </Form.Item>
              <Form.Item
                className="mb-0"
                label="CAP Long"
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
              >
                {submatch?.cap_long}
              </Form.Item>
              <Form.Item
                className="mb-0"
                label="LAP Short"
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
              >
                {submatch?.lap_short}
              </Form.Item>
              <Form.Item
                className="mb-0"
                label="CAP Short"
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
              >
                {submatch?.cap_short}
              </Form.Item>
            </div>
          </Card>
        </Form>
      )
    if (gt === '1X2')
      return (
        <Form
          size="small"
          form={form}
          initialValues={{
            ...submatch,
          }}
        >
          <Card size="small">
            <Divider orientation="left" className="m-0">
              ({display_time} {gt})
            </Divider>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '85px 100px 100px 100px',
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
                gridTemplateColumns: '85px 150px 150px',
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
          </Card>
        </Form>
      )

    return null
  },
)

/**
 * @param {string} gt 'AH' | 'OU' | 'OE' | '1X2' | 'ML'
 */
export default connect(mapStateToProps, null)(SectionProfileGameType)
