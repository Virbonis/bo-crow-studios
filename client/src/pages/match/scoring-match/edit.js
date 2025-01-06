import { Form, InputNumber } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/scoring-match/actions'

const mapDispatchToProps = dispatch => ({
  UpdateScore: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_HOME_AWAY_POSISI,
      payload,
      successCallback,
      source: 'Scoring Match',
    })
  },
})

const EditScoringMatch = ({ editValue, UpdateScore, successCallback }) => {
  const [form] = Form.useForm()

  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      labelAlign="left"
      form={form}
      id="edit-form"
      initialValues={editValue}
      onFinish={values => {
        UpdateScore({ match_id: editValue.match_id, ...values }, successCallback)
      }}
    >
      <Form.Item name="home_posisi" label={editValue.home_name}>
        <InputNumber min={0} maxLength={3} />
      </Form.Item>
      <Form.Item name="away_posisi" label={editValue.away_name}>
        <InputNumber min={0} maxLength={3} />
      </Form.Item>
    </Form>
  )
}

export default connect(null, mapDispatchToProps)(EditScoringMatch)
