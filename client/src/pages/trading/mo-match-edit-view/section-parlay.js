import React from 'react'
import { connect } from 'react-redux'
import { Card, Checkbox, Col, Divider, Form, Row, Select } from 'antd'
import { isEmpty } from 'lodash'
import { isAH, isGAH, isML, isOE, isOU, spreadDiffOptions } from 'helper'

const mapStateToProps = ({ moEdit }) => ({
  match_id: moEdit.editValue.match_id,
  display_admin: moEdit.editValue.display_admin,
  submatch: moEdit.data.submatch,
  submatch1X2: moEdit.data.submatch_1X2,
})

const SectionParlay = React.memo(({ display_admin, page, submatch, submatch1X2 }) => {
  if (isEmpty(submatch)) return null

  const [form] = Form.useForm()
  React.useEffect(() => {
    form.resetFields()
  }, [submatch, form])

  const display_time = display_admin > 30 ? 'HT' : 'FT'

  const submatchAH = submatch.findLast(x => isAH(x.game_type))
  const submatchOU = submatch.findLast(x => isOU(x.game_type))
  const submatchOE = submatch.findLast(x => isOE(x.game_type))
  const submatchML = submatch.findLast(x => isML(x.game_type))
  const submatchGAH = submatch.findLast(x => isGAH(x.game_type))

  const defaultValue = {
    hdp_odds_spread_parlay: submatchAH?.odds_spread_parlay,
    hdp_odds_spread_parlay_live: submatchAH?.odds_spread_parlay_live,
    ou_odds_spread_parlay: submatchOU?.odds_spread_parlay,
    ou_odds_spread_parlay_live: submatchOU?.odds_spread_parlay_live,
    gah_odds_spread_parlay: submatchGAH?.odds_spread_parlay,
    gah_odds_spread_parlay_live: submatchGAH?.odds_spread_parlay_live,

    hdp_mix_parlay: (submatchAH?.st_parlay ?? 1) !== 1, // default false
    ou_mix_parlay: (submatchOU?.st_parlay ?? 1) !== 1, // default false
    gah_mix_parlay: (submatchGAH?.st_parlay ?? 1) !== 1, // default false
    oe_mix_parlay: (submatchOE?.st_parlay ?? 1) !== 1, // default false
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
    >
      <Card size="small">
        <Divider orientation="left" className="m-0">
          Parlay Spread diff & Enable Status ({display_time})
        </Divider>
        <Row>
          <Col span={12}>
            <Row>
              <Col span={8} offset={8}>
                Dead
              </Col>
              <Col span={8}>Live</Col>
            </Row>
            {page === 'MOTennis' ? (
              <>
                <SpreadDiff label="HDP" gt="hdp" />
                <SpreadDiff label="G.AH" gt="gah" />
                <SpreadDiff label="G.OU" gt="ou" />
              </>
            ) : (
              <>
                <SpreadDiff label="HDP" gt="hdp" />
                <SpreadDiff label="OU" gt="ou" />
              </>
            )}
          </Col>
          <Col span={12}>
            <div style={{ textAlign: 'center' }}>Parlay Enable Status</div>
            <Row>
              {page === 'MOTennis' ? (
                <>
                  <ParlayStatus label="HDP" gt="hdp" />
                  <ParlayStatus label="G.AH" gt="gah" />
                  <ParlayStatus label="G.OU" gt="ou" />
                  <ParlayStatus label="G.OE" gt="oe" />
                </>
              ) : (
                <>
                  <ParlayStatus label="HDP" gt="hdp" />
                  <ParlayStatus label="OE" gt="oe" />
                  <ParlayStatus label="OU" gt="ou" />
                </>
              )}
              {page === 'MOOS' || page === 'MOTennis' ? (
                <ParlayStatus label="ML" gt="ml" />
              ) : (
                <ParlayStatus label="1X2" gt="1X2" />
              )}
            </Row>
          </Col>
        </Row>
      </Card>
    </Form>
  )
})
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

export default connect(mapStateToProps, null)(SectionParlay)
