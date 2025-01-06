import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Form, Input, InputNumber } from 'antd'
import actions from 'redux/branch/actions'

const mapDispatchToProps = dispatch => ({
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
      source: 'Master Branch',
    })
  },
})

const EditMasterBranch = ({ Update, successCallback, editValue }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue(editValue)
  }, [form, editValue])

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
      <Form.Item name="branch_id" label="Branch ID">
        <Input type="text" className="w-100" placeholder="Branch ID" disabled />
      </Form.Item>
      <Form.Item
        name="branch_name"
        label="Branch Name"
        rules={[{ required: true, message: 'Please input Branch Name' }]}
      >
        <Input type="text" className="w-100" placeholder="Branch Name" disabled />
      </Form.Item>
      <Form.Item
        name="max_bet_multiplier"
        label="Max Bet Multiplier"
        rules={[
          { required: true, message: 'Please input Max Bet Multiplier' },
          {
            type: 'number',
            message: 'Miminal value is 1',
            min: 1,
          },
        ]}
      >
        <InputNumber type="text" className="w-100" placeholder="Max Bet Multiplier" />
      </Form.Item>
      <Form.Item
        name="odds_trigger_multiplier"
        label="Odds Trigger Multiplier"
        rules={[
          { required: true, message: 'Please input Odds Trigger Multiplier' },
          {
            type: 'number',
            message: 'Miminal value is 1',
            min: 1,
          },
        ]}
      >
        <InputNumber type="text" className="w-100" placeholder="Odds Trigger Multiplier" />
      </Form.Item>
      <Form.Item
        name="pause_multiplier"
        label="Pause Multiplier"
        rules={[
          {
            required: true,
            message: 'Please input Pause Multiplier',
          },
          {
            type: 'number',
            message: 'Miminal value is 1',
            min: 1,
          },
        ]}
      >
        <InputNumber type="text" className="w-100" placeholder="Pause Multiplier" />
      </Form.Item>
    </Form>
  )
}

export default connect(null, mapDispatchToProps)(EditMasterBranch)
