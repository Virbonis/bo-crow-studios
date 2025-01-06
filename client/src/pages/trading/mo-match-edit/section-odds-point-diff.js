import React from 'react'
import { connect } from 'react-redux'
import { Button, Card, Col, Divider, Form, InputNumber, Row, Space } from 'antd'
import { isEmpty } from 'lodash'
import actions from 'redux/mo-match-edit/actions'
import { getGameTypeDescriptionShort, listGT } from 'helper'

const mapStateToProps = ({ moEdit }) => ({
  match: moEdit.data.match,
  submatch: moEdit.data.submatch,
})
const mapDispatchToProps = dispatch => ({
  UpdateOddsPointDiff: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_ODDS_POINT_DIFF,
      payload,
      successCallback,
    })
  },
})

const SectionOddsPointDiff = ({ match, submatch, OU = true, UpdateOddsPointDiff, readOnly }) => {
  const [form] = Form.useForm()
  React.useEffect(() => {
    form.resetFields()
  }, [submatch, form])

  if (isEmpty(submatch)) return null
  const submatchAH = submatch.findLast(x => listGT.Handicap.includes(x.game_type))
  const submatchOU = submatch.findLast(x => listGT.OverUnder.includes(x.game_type))

  return (
    <Form
      size="small"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      form={form}
      initialValues={{
        hdp_odds_point_diff: submatchAH?.odds_point_diff,
        hdp_odds_point_diff_live: submatchAH?.odds_point_diff_live,
        ou_odds_point_diff: submatchOU?.odds_point_diff,
        ou_odds_point_diff_live: submatchOU?.odds_point_diff_live,
      }}
      onFinish={values => {
        UpdateOddsPointDiff({
          match_id: match.match_id,
          ...values,
        })
      }}
    >
      <Card size="small">
        <Divider orientation="left" className="m-0">
          Odds Point Diff (Pink Colour)
        </Divider>
        <Row>
          <Col span={8} offset={8}>
            Dead
          </Col>
          <Col span={8}> Live</Col>
        </Row>
        <Form.Item className="mb-0" label={getGameTypeDescriptionShort(submatchAH?.game_type)}>
          <Space>
            <Form.Item
              className="mb-0"
              name="hdp_odds_point_diff"
              rules={[{ required: true, message: '' }]}
            >
              <InputNumber className="w-100" />
            </Form.Item>
            <Form.Item
              className="mb-0"
              name="hdp_odds_point_diff_live"
              rules={[{ required: true, message: '' }]}
            >
              <InputNumber className="w-100" />
            </Form.Item>
          </Space>
        </Form.Item>
        {OU && (
          <Form.Item className="mb-0" label={getGameTypeDescriptionShort(submatchOU?.game_type)}>
            <Space>
              <Form.Item
                className="mb-0"
                name="ou_odds_point_diff"
                rules={[{ required: true, message: '' }]}
              >
                <InputNumber className="w-100" />
              </Form.Item>
              <Form.Item
                className="mb-0"
                name="ou_odds_point_diff_live"
                rules={[{ required: true, message: '' }]}
              >
                <InputNumber className="w-100" />
              </Form.Item>
            </Space>
          </Form.Item>
        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(SectionOddsPointDiff)
