import { DatePicker, Form } from 'antd'
import dayjs from 'dayjs'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import actions from 'redux/list-auto-oods/actions'

const mapDispatchToProps = dispatch => ({
  Update: (payload, successCallback) =>
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
      source: 'List Auto Odds',
    }),
})

const Edit = ({ editValue, successCallback, Update }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({
      match_date_ibc: dayjs.utc(editValue.match_date_ibc),
    })
  }, [form, editValue])
  return (
    <>
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelAlign="left"
        id="edit-form"
        onFinish={values => {
          Update(
            {
              ...editValue,
              match_date_ibc: values.match_date_ibc.format('YYYY-MM-DD HH:mm'),
            },
            successCallback,
          )
        }}
      >
        <Form.Item label="Match ID">{editValue.match_id}</Form.Item>
        <Form.Item label="League">{editValue.league_name}</Form.Item>
        <Form.Item label="Home Team">{editValue.home_name}</Form.Item>
        <Form.Item label="Away Team">{editValue.away_name}</Form.Item>
        <Form.Item label="Match ID IBC">{editValue.match_id_ibc}</Form.Item>
        <Form.Item label="League IBC">{editValue.league_name_ibc}</Form.Item>
        <Form.Item label="Home Team IBC">{editValue.home_name_ibc}</Form.Item>
        <Form.Item label="Away Team IBC">{editValue.away_name_ibc}</Form.Item>
        <Form.Item label="Match Date IBC" name="match_date_ibc">
          <DatePicker showTime={{ format: 'HH:mm' }} allowClear={false} />
        </Form.Item>
      </Form>
    </>
  )
}

export default connect(null, mapDispatchToProps)(Edit)
