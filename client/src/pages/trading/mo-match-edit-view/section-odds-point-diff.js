import React from 'react'
import { connect } from 'react-redux'
import { Card, Col, Divider, Form, InputNumber, Row, Space } from 'antd'
import { isEmpty } from 'lodash'
import actions from 'redux/mo-match-edit/actions'
import { isAH, isOU } from 'helper'

const mapStateToProps = ({ moEdit }) => ({
  match_id: moEdit.editValue.match_id,
  display_admin: moEdit.editValue.display_admin,
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

const SectionOddsPointDiff = React.memo(
  ({ match_id, display_admin, submatch, OU = true, UpdateOddsPointDiff }) => {
    if (isEmpty(submatch)) return null

    const [form] = Form.useForm()
    React.useEffect(() => {
      form.resetFields()
    }, [submatch, form])

    const submatchAH = submatch.findLast(x => isAH(x.game_type))
    const submatchOU = submatch.findLast(x => isOU(x.game_type))

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
            match_id,
            display_admin,
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
          <Form.Item className="mb-0" label="HDP">
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
            <Form.Item className="mb-0" label="OU">
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
        </Card>
      </Form>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(SectionOddsPointDiff)
