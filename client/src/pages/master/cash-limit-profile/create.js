import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Select } from 'antd'
import actions from 'redux/cash-limit-profile/actions'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'

const mapDispatchToProps = dispatch => ({
  Create: (payload, successCallback) => {
    dispatch({
      type: actions.CREATE,
      payload,
      successCallback,
      source: 'Add Cash Limit Profile',
    })
  },
})

const AddCashLimitProfile = ({ successCallback, Create }) => {
  const [form] = Form.useForm()

  const { branchOptions, currencyOptions } = useSelectOptions()

  useEffect(() => {
    form.setFieldsValue()
  }, [form])

  return (
    <>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        labelAlign="left"
        form={form}
        id="addForm"
        onFinish={values => Create(values, successCallback)}
      >
        <Form.Item
          name="profile_id"
          rules={[{ required: true, message: 'Please Input Profile ID' }]}
          label="Profile Id"
        >
          <Input className="w-100" placeholder="Profile ID Name" />
        </Form.Item>

        <Form.Item
          label="Branch"
          name="branch_code"
          rules={[{ required: true, message: 'Please Input Branch' }]}
        >
          <Select
            placeholder="Select Branch"
            showSearch
            className="w-100"
            options={branchOptions}
          />
        </Form.Item>

        <Form.Item
          name="currency"
          label="Currency"
          rules={[{ required: true, message: 'Please Input Currency' }]}
        >
          <Select
            placeholder="Select Currency"
            showSearch
            className="w-100"
            options={currencyOptions}
          />
        </Form.Item>
      </Form>
    </>
  )
}

export default connect(null, mapDispatchToProps)(AddCashLimitProfile)
