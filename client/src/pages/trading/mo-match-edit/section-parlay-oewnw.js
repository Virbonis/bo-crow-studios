import React from 'react'
import { connect } from 'react-redux'
import { Button, Card, Checkbox, Col, Divider, Form, Row } from 'antd'
import { isEmpty } from 'lodash'
import actions from 'redux/mo-match-edit/actions'
import { listGT } from 'helper'

const mapStateToProps = ({ moEdit }) => ({
  match_id: moEdit.editValue.match_id,
  display_admin: moEdit.editValue.display_admin,
  submatch: moEdit.data.submatch,
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

// gt = OEGOE/HWNW/AWNW
const SectionParlayOEWNW = ({ match_id, display_admin, submatch, gt, UpdateParlay }) => {
  const [form] = Form.useForm()
  React.useEffect(() => {
    form.resetFields()
  }, [submatch, form])

  if (isEmpty(submatch)) return null
  const submatchOEWNW = submatch.findLast(x => listGT[gt].includes(x.game_type))
  if (!submatchOEWNW) return null

  return (
    <Form
      size="small"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      form={form}
      initialValues={{ ...submatchOEWNW, mix_parlay: submatchOEWNW.st_parlay !== 1 }}
      onFinish={values => {
        const updateKey = `${gt.toLowerCase()}_mix_parlay`
        UpdateParlay({
          match_id,
          display_admin,
          [updateKey]: values.mix_parlay ? 0 : 1,
        })
      }}
    >
      <Card size="small">
        <Divider orientation="left" className="m-0">
          Parlay Spread diff & Enable Status
        </Divider>
        <Row>
          <Col span={12}>
            <Form.Item className="mb-0" label="Spread">
              {submatchOEWNW.spread_sbo}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item className="mb-0" label="Parlay" name="mix_parlay" valuePropName="checked">
              <Checkbox />
            </Form.Item>
          </Col>
        </Row>
        <Divider orientation="right" className="m-0">
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Divider>
      </Card>
    </Form>
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(SectionParlayOEWNW)
