import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Select } from 'antd'
import actions from 'redux/cancel-match/actions'

const mapDispatchToProps = dispatch => ({
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
      source: 'Cancel Match',
    })
  },
})

const CancelMatchCategory = ({ editValue, successCallback, Update }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ ...editValue, match_score_status: editValue.match_score_status })
  }, [form, editValue])

  const cancelTypeOptions = React.useMemo(() => {
    const { match_score_status, ht_process_status } = editValue
    if (match_score_status === 'Match Cancelled') return [{ value: 81, label: 'Uncancel Match' }]

    if (match_score_status === '1st Half Cancelled')
      return [{ value: 87, label: 'Uncancel 1st Half' }]

    if (match_score_status === '2nd Half Cancelled')
      return [{ value: 83, label: 'Uncancel 2nd Half' }]

    if (match_score_status === 'Half Time Scored' || match_score_status === 'Full Time Scored') {
      if (ht_process_status === 'Y') return [{ value: 82, label: 'Cancel 2nd Half' }]
      return [
        { value: 80, label: 'Cancel Match' },
        { value: 82, label: 'Cancel 2nd Half' },
      ]
    }
    return [
      { value: 80, label: 'Cancel Match' },
      { value: 85, label: 'Cancel 1st Half' },
    ]
  }, [editValue])

  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      labelAlign="left"
      form={form}
      id="edit-form"
      onFinish={values => {
        Update({ ...editValue, ...values }, successCallback)
      }}
      initialValues={editValue}
    >
      <Form.Item label="Match ID">{`${editValue.match_id}`}</Form.Item>
      <Form.Item
        name="void_id"
        label="Type"
        rules={[{ required: true, message: 'Please input Cancel Type' }]}
      >
        <Select placeholder="Select Cancel Type" showSearch options={cancelTypeOptions} />
      </Form.Item>
      <Form.Item name="void_reason" label="Reason" rules={[{ message: 'Please input Reason' }]}>
        <Input type="text" placeholder="Reason" />
      </Form.Item>
    </Form>
  )
}

export default connect(null, mapDispatchToProps)(CancelMatchCategory)
