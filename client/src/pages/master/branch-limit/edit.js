import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Form, Input, InputNumber } from 'antd'
import actions from 'redux/branch/actions'

const mapDispatchToProps = dispatch => ({
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_LIMIT,
      payload,
      successCallback,
    })
  },
})

const EditBranchLimit = ({ editBranchValue, successCallback, Update }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue(editBranchValue)
  }, [form, editBranchValue])

  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      labelAlign="left"
      form={form}
      id="edit-form"
      onFinish={values => Update({ ...editBranchValue, ...values }, successCallback)}
      initialValues={{
        ...editBranchValue,
      }}
    >
      <Form.Item name="branch_id" label="Branch Id">
        <Input type="text" className="w-100" placeholder="currency" disabled />
      </Form.Item>
      <Form.Item name="branch_name" label="Branch Name">
        <Input type="text" className="w-100" disabled />
      </Form.Item>
      <Form.Item name="currency" label="currency">
        <Input className="w-100" disabled />
      </Form.Item>
      <Form.Item
        name="min_bet"
        label="Min Bet"
        rules={[
          { required: true, message: 'Please input Min Bet' },
          { min: 1, type: 'number', message: 'Minimum Bet is 1' },
        ]}
      >
        <InputNumber className="w-100" placeholder="Min Bet" maxLength={10} />
      </Form.Item>
      <Form.Item
        name="min_bet_parlay"
        label="Min Bet Parlay"
        rules={[
          { required: true, message: 'Please input Min Bet Parlay' },
          { min: 1, type: 'number', message: 'Minimum Bet Parlay is 1' },
        ]}
      >
        <InputNumber className="w-100" placeholder="Min Bet Parlay" maxLength={10} />
      </Form.Item>
      <Form.Item
        name="max_payout_parlay"
        label="Max Payout Parlay"
        rules={[
          { required: true, message: 'Please input Max Payout Parlay' },
          { min: 1, type: 'number', message: 'Minimum Max Payout Parlay is 1' },
        ]}
      >
        <InputNumber className="w-100" placeholder="Max Payout Parlay" maxLength={10} />
      </Form.Item>
    </Form>
  )
}

export default connect(null, mapDispatchToProps)(EditBranchLimit)
