import React from 'react'
import { connect } from 'react-redux'
import { Button, Card, Checkbox, Col, Divider, Form, Row, Select } from 'antd'
import { isEmpty } from 'lodash'
import actions from 'redux/mo-match-edit/actions'
import { getGameTypeDescriptionShort, listGT, spreadDiffOptions } from 'helper'

const mapStateToProps = ({ moEdit }) => ({
  match_id: moEdit.editValue.match_id,
  display_admin: moEdit.editValue.display_admin,
  sport_id: moEdit.editValue.sport_id,
  submatch: moEdit.data.submatch,
  submatch1X2: moEdit.data.submatch_1X2,
})
const mapDispatchToProps = dispatch => ({
  UpdateParlay: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_PARLAY,
      payload,
      successCallback,
    })
  },
})

const SectionParlay = ({
  match_id,
  display_admin,
  sport_id,
  submatch,
  submatch1X2,
  UpdateParlay,
  readOnly,
}) => {
  const [form] = Form.useForm()
  React.useEffect(() => {
    form.resetFields()
  }, [submatch, form])

  if (isEmpty(submatch)) return null
  const submatchAHSW = submatch.findLast(x => listGT.AHSW.includes(x.game_type))
  const submatchGAH = submatch.findLast(x => listGT.GAH.includes(x.game_type))
  const submatchOUGOU = submatch.findLast(x => listGT.OUGOU.includes(x.game_type))
  const submatchOEGOE = submatch.findLast(x => listGT.OEGOE.includes(x.game_type))
  const submatchML = submatch.findLast(x => listGT.ML.includes(x.game_type))

  const defaultValue = {
    hdp_odds_spread_parlay: submatchAHSW?.odds_spread_parlay,
    hdp_odds_spread_parlay_live: submatchAHSW?.odds_spread_parlay_live,
    ou_odds_spread_parlay: submatchOUGOU?.odds_spread_parlay,
    ou_odds_spread_parlay_live: submatchOUGOU?.odds_spread_parlay_live,
    gah_odds_spread_parlay: submatchGAH?.odds_spread_parlay,
    gah_odds_spread_parlay_live: submatchGAH?.odds_spread_parlay_live,

    hdp_mix_parlay: (submatchAHSW?.st_parlay ?? 1) !== 1, // default false
    ou_mix_parlay: (submatchOUGOU?.st_parlay ?? 1) !== 1, // default false
    gah_mix_parlay: (submatchGAH?.st_parlay ?? 1) !== 1, // default false
    oe_mix_parlay: (submatchOEGOE?.st_parlay ?? 1) !== 1, // default false
    '1X2_mix_parlay': (submatch1X2?.st_parlay ?? 1) !== 1, // default false
    ml_mix_parlay: (submatchML?.st_parlay ?? 1) !== 1, // default false
  }

  return (
    <Form
      size="small"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      form={form}
      initialValues={defaultValue}
      onFinish={values => {
        const payload = {
          ...values,
          hdp_mix_parlay: values.hdp_mix_parlay ? 0 : 1,
          ou_mix_parlay: values.ou_mix_parlay ? 0 : 1,
          oe_mix_parlay: values.oe_mix_parlay ? 0 : 1,
          gah_mix_parlay: values.gah_mix_parlay ? 0 : 1,
          ml_mix_parlay: values.ml_mix_parlay ? 0 : 1,
          '1X2_mix_parlay': values['1X2_mix_parlay'] ? 0 : 1,
        }
        UpdateParlay({
          ...payload,
          match_id,
          display_admin,
          sport_id,
        })
      }}
    >
      <Card size="small">
        <Divider orientation="left" className="m-0">
          Parlay Spread diff & Enable Status
        </Divider>
        <Row>
          <Col span={12}>
            <Row>
              <Col span={8} offset={8}>
                Dead
              </Col>
              <Col span={8}>Live</Col>
            </Row>
            {submatchAHSW && (
              <SpreadDiff label={getGameTypeDescriptionShort(submatchAHSW?.game_type)} gt="hdp" />
            )}
            {submatchGAH && (
              <SpreadDiff label={getGameTypeDescriptionShort(submatchGAH?.game_type)} gt="gah" />
            )}
            {submatchOUGOU && (
              <SpreadDiff label={getGameTypeDescriptionShort(submatchOUGOU?.game_type)} gt="ou" />
            )}
          </Col>
          <Col span={12}>
            <div style={{ textAlign: 'center' }}>Parlay Enable Status</div>
            <Row>
              {submatchAHSW && (
                <ParlayStatus
                  label={getGameTypeDescriptionShort(submatchAHSW?.game_type)}
                  gt="hdp"
                />
              )}
              {submatchGAH && (
                <ParlayStatus
                  label={getGameTypeDescriptionShort(submatchGAH?.game_type)}
                  gt="gah"
                />
              )}
              {submatchOUGOU && (
                <ParlayStatus
                  label={getGameTypeDescriptionShort(submatchOUGOU?.game_type)}
                  gt="ou"
                />
              )}
              {submatchOEGOE && (
                <ParlayStatus
                  label={getGameTypeDescriptionShort(submatchOEGOE?.game_type)}
                  gt="oe"
                />
              )}
              {submatchML && (
                <ParlayStatus label={getGameTypeDescriptionShort(submatchML?.game_type)} gt="ml" />
              )}
              {submatch1X2 && <ParlayStatus label="1X2" gt="1X2" />}
            </Row>
          </Col>
        </Row>

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
const SpreadDiff = ({ label, gt }) => {
  return (
    <Form.Item className="mb-0" label={label}>
      <Row>
        <Col span={12}>
          <Form.Item className="mb-0" name={`${gt}_odds_spread_parlay`}>
            <Select className="w-100" options={spreadDiffOptions} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item className="mb-0" name={`${gt}_odds_spread_parlay_live`}>
            <Select className="w-100" options={spreadDiffOptions} />
          </Form.Item>
        </Col>
      </Row>
    </Form.Item>
  )
}
const ParlayStatus = ({ label, gt }) => {
  return (
    <Col span={12}>
      <Form.Item
        className="mb-0"
        label={label}
        name={`${gt}_mix_parlay`}
        labelCol={{ span: 16 }}
        wrapperCol={{ span: 8 }}
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>
    </Col>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(SectionParlay)
