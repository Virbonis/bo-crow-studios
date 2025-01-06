import { Form, Input, InputNumber, Select } from 'antd'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/customer-buyback/actions'

const mapDispatchToProps = dispatch => ({
  LoadSelectCustomerUpline: () => {
    dispatch({
      type: actions.LOAD_SELECT_CUSTOMER_UPLINE,
      source: 'Customer Buyback',
    })
  },
  Create: (payload, successCallback) => {
    dispatch({
      type: actions.CREATE_CUSTOMER_BUYBACK,
      payload,
      successCallback,
      source: 'Scoring Match',
    })
  },
})

const AddUser = ({ successCallback, LoadSelectCustomerUpline, Create }) => {
  const { customerUplineOptions } = useSelectOptions()

  React.useEffect(() => {
    LoadSelectCustomerUpline()
  }, [LoadSelectCustomerUpline])

  const [form] = Form.useForm()
  React.useEffect(() => {
    form.setFieldsValue({
      comm_pct: 0,
      comm_pct_others: 0,
      pt_share: 100,
      customer_id: customerUplineOptions[0]?.value,
    })
  }, [form, customerUplineOptions[0]?.value]) // eslint-disable-line

  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      labelAlign="left"
      form={form}
      id="add-user-form"
      onFinish={values => {
        Create({ ...values, customer_upline_id: values.customer_id }, successCallback)
      }}
    >
      <Form.Item name="customer_id" label="Customer">
        <Select options={customerUplineOptions} placeholder="Select Customer" />
      </Form.Item>
      <Form.Item
        name="username"
        label="Username"
        rules={[
          { required: true, message: 'Please Input Username' },
          {
            validator: (_, value) => {
              if (value?.includes(' ')) {
                return Promise.reject(new Error('No spaces allowed'))
              }
              if (/[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/.test(value)) {
                return Promise.reject(new Error('Underscore and Numeric'))
              }
              return Promise.resolve()
            },
          },
        ]}
      >
        <Input maxLength={20} placeholder="Input Username" />
      </Form.Item>
      <Form.Item name="comm_pct" label="Comm Pct(%)">
        <InputNumber min={0} max={100} maxLength={6} step={0.01} />
      </Form.Item>
      <Form.Item name="comm_pct_others" label="Comm Pct Others(%)">
        <InputNumber min={0} max={100} maxLength={6} step={0.01} />
      </Form.Item>
      <Form.Item name="pt_share" label="PT Share(%)">
        <InputNumber min={0} max={100} maxLength={6} step={0.01} />
      </Form.Item>
    </Form>
  )
}

export default connect(null, mapDispatchToProps)(AddUser)
